#!/usr/bin/env python
# coding: utf-8

# In[61]:


import pandas as pd

# Googleフォームのマップリストと同じ順番になっている必要あり
map_list = [
    "銀行",
    "国境",
    "クラブハウス",
    "海岸線",
    "領事館",
    "カフェ・ドストエフスキー",
    "ヴィラ"
]

df = pd.read_csv("Excelsior Gaming R6S Scrim Log.csv")


# In[62]:


game_d = {
    "game_id": [], # 試合ID
    "date": pd.to_datetime(df["ゲーム開始時の日付"], format="%Y-%m-%d"), # ゲーム開始時の日付
    "opponent": df["相手のチーム名"], # 相手のチーム名
    "map": df["マップ"], # マップ
    "offense_first": df["先攻"].str.replace("自チーム", "own").str.replace("相手チーム", "opponent"), # 先攻
    "offense_ban_own": [], # 自チーム攻撃側オペレーターBAN
    "defense_ban_own": [], # 自チーム防衛側オペレーターBAN
    "offense_ban_opponent": [], # 相手チーム攻撃側オペレーターBAN
    "defense_ban_opponent": [], # 相手チーム防衛側オペレーターBAN
    "result": [], # 試合結果
    "score_own": [], # 自チームスコア
    "score_opponent": [] # 相手チームスコア
}

round_d = {
    "game_id": [], # 試合ID
    "num": [], # ラウンド数
    "o/d": [], # 攻防
    "point": [], # 防衛地点
    "w/l": [] # 勝敗
}

score_d = {
    "game_id": [], # 試合ID
    "team": [], # チーム名
    "uplayid": [], # UplayID
    "score": [], # スコア
    "kill": [], # キル
    "assist": [], # アシスト
    "death": [] # デス
}

game_id = 0
for row in df.itertuples():
    score_own = 0
    score_opponent = 0

    # game_d
    game_d["game_id"].append(game_id)
    if row[4] == "自チーム": # 自チーム先攻
        game_d["offense_ban_own"].append(row[6])
        game_d["defense_ban_own"].append(row[7])
        game_d["offense_ban_opponent"].append(row[5])
        game_d["defense_ban_opponent"].append(row[8])
    else: # 自チーム後攻
        game_d["offense_ban_own"].append(row[5])
        game_d["defense_ban_own"].append(row[8])
        game_d["offense_ban_opponent"].append(row[6])
        game_d["defense_ban_opponent"].append(row[7])
        
    # round_d
    map_index = map_list.index(row[9])
    round_row = row[(10 + map_index * 32):(42 + map_index * 32)]
    for i in range(15):
        if not pd.isnull(round_row[i]):
            round_d["game_id"].append(game_id)
            round_d["num"].append(i + 1)
            round_d["point"].append(round_row[i + 15])
            if round_row[i] == "自チーム":
                round_d["w/l"].append("win")
                score_own += 1
            else:
                round_d["w/l"].append("lose")
                score_opponent += 1
            if 0 <= i <= 5:
                round_d["o/d"].append("offense" if row[4] == "自チーム" else "defense")
            elif 6 <= i <= 11:
                round_d["o/d"].append("defense" if row[4] == "自チーム" else "offense")
            else:
                if round_row[30] == "自チーム":
                    round_d["o/d"].append("offense" if i % 2 == 0 else "defense")
                else:
                    round_d["o/d"].append("defense" if i % 2 == 0 else "offense")
    
    # score_d
    score_list = round_row[31].split("\n")
    score_list.remove("")
    for idx, player in enumerate(score_list):
        score_d["game_id"].append(game_id)
        score_d["team"].append("Excelsior Gaming" if 0 <= idx <= 4 else row[3])
        values = player.split(" ")
        score_d["uplayid"].append(values[0])
        score_d["score"].append(int(values[1]))
        score_d["kill"].append(int(values[2]))
        score_d["assist"].append(int(values[3]))
        score_d["death"].append(int(values[4]))
        
    # game_d
    if score_own > score_opponent:
        game_d["result"].append("win")
    elif score_own < score_opponent:
        game_d["result"].append("lose")
    else:
        game_d["result"].append("draw")
    game_d["score_own"].append(score_own)
    game_d["score_opponent"].append(score_opponent)

    game_id += 1
      
pd.DataFrame(game_d).to_csv("./game.csv", index=False)
pd.DataFrame(round_d).to_csv("./round.csv", index=False)
pd.DataFrame(score_d).to_csv("./score.csv", index=False)


# In[ ]:




