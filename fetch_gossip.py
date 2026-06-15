import requests
from bs4 import BeautifulSoup
import json
import os

def fetch_global_gossip():
    url = "https://www.buzzfeed.com/celebrity.xml"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, features="xml")
        items = soup.find_all('item')
        
        gossip_pool = []
        for item in items[:10]: # 抓取前10条
            title = item.title.text.strip().replace('"', '\\"').replace("'", "\\'")
            gossip_pool.append(f"🔥 [BREAKING] {title}")
            
        # 📌 核心改动：定位到 Next.js 项目的 public 目录下
        current_dir = os.path.dirname(os.path.abspath(__file__))
        target_path = os.path.join(current_dir, "public", "gossip.json")
        
        # 将数据写入本地 json 文件
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(gossip_pool, f, ensure_ascii=False, indent=2)
            
        print(f"🎉 自动化数据交接成功！最新八卦已写入：{target_path}")
        return True

    except Exception as e:
        print(f"❌ 自动化替换失败: {e}")
        return False

if __name__ == "__main__":
    fetch_global_gossip()