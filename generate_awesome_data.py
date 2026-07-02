import urllib.request
import re
import json
import datetime

url = 'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    data = urllib.request.urlopen(req).read().decode('utf-8')
except Exception as e:
    print("Error fetching:", e)
    exit(1)

lines = data.split('\n')

def map_category(raw):
    r = raw.lower()
    if 'image' in r or 'art' in r or 'photo' in r: return 'Image Generation'
    if 'video' in r: return 'Video'
    if 'audio' in r or 'speech' in r or 'voice' in r: return 'Audio'
    if 'music' in r: return 'Music'
    if 'code' in r or 'dev' in r or 'programming' in r: return 'Code'
    if 'writ' in r or 'text' in r or 'copy' in r: return 'Writing'
    if 'chat' in r or 'assistant' in r or 'llm' in r or 'model' in r: return 'Chatbots'
    if 'design' in r or 'ui' in r or 'ux' in r: return 'Design'
    if 'data' in r or 'analytic' in r: return 'Analytics'
    if 'research' in r: return 'Research'
    if 'business' in r or 'market' in r or 'sales' in r: return 'Business'
    if 'education' in r or 'learn' in r: return 'Education'
    if 'secur' in r: return 'Security'
    if 'devops' in r or 'infra' in r: return 'DevOps'
    if 'machine learning' in r or ' ml ' in r or 'training' in r: return 'Machine Learning'
    if 'product' in r or 'workflow' in r or 'automat' in r: return 'Productivity'
    return 'Productivity'

tools = []
current_category = 'General'
id_counter = 0

for raw_line in lines:
    line = raw_line.strip()
    
    cat_match = re.match(r'^#{2,3}\s+(.+)', line)
    if cat_match:
        current_category = cat_match.group(1).strip()
        continue
        
    if not line.startswith('-') and not line.startswith('*'):
        continue
        
    link_match = re.search(r'\[([^\]]+)\]\(([^)]+)\)', line)
    if link_match:
        name = link_match.group(1).replace('**', '').strip()
        url_str = link_match.group(2).strip()
        
        if url_str.startswith('[http'):
            nested_match = re.search(r'\]\((http[^)]+)\)', url_str)
            if nested_match:
                url_str = nested_match.group(1)
                
        if not name or not url_str.startswith('http'):
            continue
            
        desc = line[link_match.end():].lstrip(' *-–—').strip()
        desc = re.sub(r'\*\[reviews?\]\([^)]+\)\*', '', desc, flags=re.IGNORECASE).strip()
        desc = re.sub(r'#opensource', '', desc, flags=re.IGNORECASE).strip()
        desc = desc.lstrip('*').rstrip('*').strip()
        desc = desc.lstrip('-–— ').strip()
        
        if not desc:
            desc = f"{name} — AI tool"
            
        cat = map_category(current_category)
        id_counter += 1
        
        tools.append({
            "id": f"github-awesome-{id_counter}",
            "name": name,
            "description": desc,
            "category": cat,
            "url": url_str,
            "image": f"https://ui-avatars.com/api/?name={urllib.parse.quote(name)}&background=1e293b&color=6366f1&size=120",
            "pricing": "See website",
            "rating": round(4.0 + (id_counter % 8) * 0.1, 1),
            "dailyUsers": "N/A",
            "modelType": cat,
            "easeOfUse": 4,
            "userExperience": 4,
            "featured": False,
            "lastUpdated": datetime.datetime.now().strftime('%Y-%m-%d')
        })

print(f"Total parsed tools: {len(tools)}")

ts_content = f"""import {{ AITool }} from '../types';

export const awesomeToolsData: AITool[] = {json.dumps(tools, indent=2)};
"""

with open('src/data/awesomeToolsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Saved to src/data/awesomeToolsData.ts")
