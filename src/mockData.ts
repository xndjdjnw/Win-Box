export type MediaItem = { id: string; title: string; year: string; genre: string; rating: string; description: string; accent: string }

export const featured: MediaItem = {
  id: 'demo-01', title: '星港余晖', year: '2026', genre: '科幻 · 剧情', rating: '9.1', accent: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
  description: '演示内容：一名修复师在远离地球的港口，追寻失联信号的来源。'
}

export const library: MediaItem[] = [
  featured,
  { id: 'demo-02', title: '沉默山谷', year: '2025', genre: '悬疑', rating: '8.7', accent: 'linear-gradient(135deg, #14532d, #0f766e)', description: '演示内容：一封未寄出的信改变了小镇的平静。' },
  { id: 'demo-03', title: '向海而行', year: '2026', genre: '冒险', rating: '8.9', accent: 'linear-gradient(135deg, #0c4a6e, #0369a1)', description: '演示内容：两位旧友展开一次海岸线旅程。' },
  { id: 'demo-04', title: '夜班电台', year: '2024', genre: '音乐 · 剧情', rating: '8.4', accent: 'linear-gradient(135deg, #581c87, #be185d)', description: '演示内容：深夜直播间里的故事与歌声。' },
  { id: 'demo-05', title: '白昼花园', year: '2025', genre: '家庭', rating: '8.2', accent: 'linear-gradient(135deg, #a16207, #ea580c)', description: '演示内容：三代人共同守护的社区花园。' }
]
