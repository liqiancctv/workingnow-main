"use client"

import React from "react"

export default function VSCodeSkin() {
  return (
    <div className="flex h-screen w-screen flex-col bg-[#1e1e1e] font-sans text-[#cccccc] select-none text-sm overflow-hidden">
      
      {/* 1. 顶部菜单栏 (Menu Bar) */}
      <div className="flex h-9 w-full items-center justify-between bg-[#3c3c3c] px-3 text-xs text-[#dddddd] border-b border-[#2b2b2b]">
        <div className="flex items-center space-x-4">
          {/* 经典的蓝白色微缩 VS Code Logo */}
          <div className="text-blue-400 font-bold scale-110">⨝</div>
          <div className="flex space-x-3 cursor-pointer">
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">File</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">Edit</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">Selection</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">View</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">Go</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">Run</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">Terminal</span>
            <span className="hover:bg-[#505050] px-2 py-0.5 rounded">Help</span>
          </div>
        </div>
        {/* 顶部中间的假项目搜索框 */}
        <div className="w-1/3 bg-[#2d2d2d] text-center border border-[#454545] py-0.5 rounded text-[#aaaaaa] text-[11px]">
          workingnow-main — Index.tsx
        </div>
        <div className="flex items-center space-x-3 text-[#aaaaaa]">
          <span>⚊</span> <span>❐</span> <span className="hover:bg-red-600 hover:text-white px-2">✕</span>
        </div>
      </div>

      {/* 2. 主体核心区（侧边栏图标 + 文件树 + 代码编辑器） */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* 2A. 最左侧活动栏 (Activity Bar) */}
        <div className="flex w-12 flex-col items-center justify-between bg-[#333333] py-4 text-xl text-[#858585]">
          <div className="flex flex-col items-center space-y-6 w-full">
            {/* 选中的文件管理器图标 */}
            <div className="text-white border-l-2 border-blue-500 w-full text-center pl-1 cursor-pointer">📄</div>
            <div className="hover:text-white cursor-pointer text-center w-full">🔍</div>
            <div className="hover:text-white cursor-pointer text-center w-full">🌿</div>
            <div className="hover:text-white cursor-pointer text-center w-full">🪲</div>
            <div className="hover:text-white cursor-pointer text-center w-full">🧩</div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="hover:text-white cursor-pointer">⚙️</div>
          </div>
        </div>

        {/* 2B. 资源管理器文件树 (Sidebar / Explorer) */}
        <div className="w-52 bg-[#252526] flex flex-col border-r border-[#2b2b2b] text-xs">
          <div className="p-3 font-bold uppercase text-[#bbbbbb] tracking-wider text-[10px] flex justify-between items-center">
            <span>Explorer: WORKINGNOW-MAIN</span>
            <span>•••</span>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
            <div className="font-bold text-[#ffffff] flex items-center space-x-1">
              <span>▼</span> <span>📂 workingnow</span>
            </div>
            <div className="pl-4 text-[#cccccc] flex items-center space-x-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer">
              <span>📂</span> <span>src</span>
            </div>
            <div className="pl-8 text-[#cccccc] flex items-center space-x-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer">
              <span>📂</span> <span>components</span>
            </div>
            <div className="pl-12 text-[#3891a6] flex items-center space-x-2 py-0.5 bg-[#37373d] font-semibold cursor-pointer">
              <span>⚛️</span> <span className="text-blue-400">Index.tsx</span>
            </div>
            <div className="pl-12 text-[#cccccc] flex items-center space-x-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer">
              <span>🎨</span> <span>global.css</span>
            </div>
            <div className="pl-4 text-[#e0a96d] flex items-center space-x-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer">
              <span>⚙️</span> <span>package.json</span>
            </div>
            <div className="pl-4 text-[#aaaaaa] flex items-center space-x-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer">
              <span>🔒</span> <span>.gitignore</span>
            </div>
          </div>
        </div>

        {/* 2C. 右侧核心代码编辑区 (Editor Area) */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          
          {/* 编辑器 Tab 标签页 */}
          <div className="flex h-9 w-full bg-[#2d2d2d] text-xs border-b border-[#1e1e1e]">
            <div className="flex items-center space-x-2 bg-[#1e1e1e] px-4 border-t border-blue-500 text-white border-r border-[#252526]">
              <span>⚛️</span> <span>Index.tsx</span> <span className="text-gray-500 hover:text-white ml-2 cursor-pointer">✕</span>
            </div>
            <div className="flex items-center space-x-2 px-4 text-[#969696] hover:bg-[#2b2b2b] hover:text-white border-r border-[#252526] cursor-pointer">
              <span>⚙️</span> <span>package.json</span>
            </div>
          </div>

          {/* 1:1 代码高亮展示区 (你今天可以把真实的摸鱼段子藏在这里！) */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed selection:bg-blue-800/30">
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">1</span>
              <p><span className="text-[#c586c0]">import</span> React, &#123; useState, useEffect &#125; <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'react'</span>;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">2</span>
              <p><span className="text-[#c586c0]">import</span> &#123; runServerMonitor &#125; <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]'">'@/lib/analytics'</span>;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">3</span>
              <p>&nbsp;</p>
            </div>
            <div className="flex text-green-600 italic">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">4</span>
              <p>{"// TODO: 【打工人高能广播】今天全网最火爆的新闻吃瓜内容已注入"}</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">5</span>
              <p><span className="text-[#569cd6]">const</span> <span className="text-[#dcdcaa]">TrendingReport</span> = () =&gt; &#123;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">6</span>
              <p>&nbsp;&nbsp;<span className="text-[#569cd6]">const</span> [breakingNews, setNews] = <span className="text-[#dcdcaa]">useState</span>([</p>
            </div>

            {/* 🔴 高能预留：这里就是你未来用 Python 脚本自动填充实时爆料段子的地方！ */}
            <div className="flex bg-yellow-500/10 border-l-2 border-yellow-500">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">7</span>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ce9178]">"🔥 华尔街今天上午突发：某量化基金因为代码少写个逗号亏损上亿..."</span>,</p>
            </div>
            <div className="flex bg-yellow-500/10 border-l-2 border-yellow-500">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">8</span>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ce9178]">"🚀 硅谷突发：科技巨头今日宣布全面裁撤所有非技术管理岗位..."</span></p>
            </div>
            
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">9</span>
              <p>&nbsp;&nbsp;]);</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">10</span>
              <p>&nbsp;&nbsp;<span className="text-[#c586c0]">return</span> (</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">11</span>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#569cd6]">div</span> className=<span className="text-[#ce9178]">"terminal-log"</span>&gt;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">12</span>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123; breakingNews.map(item =&gt; &lt;<span className="text-[#4ec9b0]">CoreData</span>&gt;&#123;item&#125;&lt;/<span className="text-[#4ec9b0]">CoreData</span>&gt;) &#125;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">13</span>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#569cd6]">div</span>&gt;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">14</span>
              <p>&nbsp;&nbsp;);</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">15</span>
              <p>&#125;</p>
            </div>
            <div className="flex">
              <span className="w-8 text-right pr-4 text-[#858585] select-none">16</span>
              <p><span className="text-[#c586c0]">export default</span> <span className="text-[#dcdcaa]">TrendingReport</span>;</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 底部状态栏 (Status Bar) */}
      <div className="flex h-6 w-full items-center justify-between bg-[#007acc] px-2 text-xs text-white">
        <div className="flex items-center space-x-3">
          <span className="bg-[#1f8ad2] px-2 h-full flex items-center font-bold">⇄ main*</span>
          <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">⊗ 0 ⚠ 0</span>
        </div>
        <div className="flex items-center space-x-3 pr-2">
          <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">Ln 7, Col 42</span>
          <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">Spaces: 2</span>
          <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">UTF-8</span>
          <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">TypeScript JSX</span>
          <span className="bg-[#1f8ad2] px-2 h-full flex items-center font-bold cursor-pointer">🔔</span>
        </div>
      </div>

    </div>
  )
}