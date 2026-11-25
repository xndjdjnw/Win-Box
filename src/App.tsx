import { useMemo, useState, type ReactNode } from 'react'
import { featured, library, type MediaItem } from './mockData'

type View = 'home' | 'search' | 'detail' | 'settings'
type Source = { id: string; name: string; address: string; enabled: boolean; updated: string }

const initialSources: Source[] = [
  { id: 'local-demo', name: '内置演示目录', address: 'demo://catalog', enabled: true, updated: '刚刚' }
]

function Card({ item, onOpen }: { item: MediaItem; onOpen: () => void }) {
  return <button className="card" onClick={onOpen}>
    <span className="poster" style={{ background: item.accent }}><span>{item.title.slice(0, 1)}</span></span>
    <strong>{item.title}</strong><small>{item.year} · {item.genre}</small><em>★ {item.rating}</em>
  </button>
}

export function App() {
  const [view, setView] = useState<View>('home')
  const [selected, setSelected] = useState<MediaItem>(featured)
  const [query, setQuery] = useState('')
  const [sources, setSources] = useState<Source[]>(initialSources)
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')
  const matches = useMemo(() => library.filter(x => `${x.title} ${x.genre}`.toLowerCase().includes(query.toLowerCase())), [query])
  const open = (item: MediaItem) => { setSelected(item); setView('detail') }

  function importSource() {
    try {
      const input = JSON.parse(draft) as { name?: unknown; address?: unknown }
      if (typeof input.name !== 'string' || !input.name.trim() || typeof input.address !== 'string') throw new Error('需要 name 和 address 两个文本字段。')
      if (!/^(https:\/\/|demo:\/\/)/.test(input.address)) throw new Error('只接受 HTTPS 或演示地址；导入不会自动连接或播放。')
      setSources(current => [...current, { id: crypto.randomUUID(), name: input.name.trim(), address: input.address.trim(), enabled: false, updated: '尚未启用' }])
      setDraft(''); setNotice('配置已保存为停用状态。请先审阅来源和授权，再手动启用。')
    } catch (error) { setNotice(error instanceof Error ? error.message : '无法读取配置。') }
  }

  return <main className="shell">
    <aside><div className="brand"><i>▶</i> Streamline</div>
      {([['home', '⌂', '首页'], ['search', '⌕', '搜索'], ['settings', '⚙', '设置']] as const).map(([id, icon, label]) => <button key={id} className={view === id ? 'nav active' : 'nav'} onClick={() => setView(id)}><span>{icon}</span>{label}</button>)}
      <div className="side-note">演示模式<br /><small>不连接第三方内容源</small></div>
    </aside>
    <section className="content">
      <header><div><p>欢迎回来</p><h1>{view === 'home' ? '发现值得看的内容' : view === 'search' ? '搜索演示目录' : view === 'settings' ? '设置与来源' : selected.title}</h1></div><button className="avatar" aria-label="账户">Z</button></header>
      {view === 'home' && <><section className="hero" style={{ background: featured.accent }}><div><span className="tag">精选 · 演示数据</span><h2>{featured.title}</h2><p>{featured.description}</p><button className="primary" onClick={() => open(featured)}>查看详情</button></div><div className="hero-art">✦</div></section><Section title="继续浏览"><div className="grid">{library.slice(1).map(item => <Card item={item} key={item.id} onOpen={() => open(item)} />)}</div></Section></>}
      {view === 'search' && <><input autoFocus className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索片名、类型（仅演示目录）" /> <Section title={query ? `找到 ${matches.length} 项` : '全部演示内容'}><div className="grid">{matches.map(item => <Card item={item} key={item.id} onOpen={() => open(item)} />)}</div></Section></>}
      {view === 'detail' && <article className="detail"><div className="detail-poster" style={{ background: selected.accent }}>{selected.title.slice(0, 1)}</div><div><span className="tag">演示内容</span><h2>{selected.title}</h2><p className="metadata">{selected.year} · {selected.genre} · ★ {selected.rating}</p><p>{selected.description}</p><button className="primary" onClick={() => setNotice('播放功能为界面占位；本项目不提供内容抓取、未授权来源访问或绕过限制。')}>播放预告（占位）</button>{notice && <p className="notice">{notice}</p>}</div></article>}
      {view === 'settings' && <section className="settings"><h2>配置来源管理</h2><p>仅保存你有权使用的来源配置。导入不会发起网络请求，也不会自动启用来源。</p><div className="source-list">{sources.map(source => <div className="source" key={source.id}><div><strong>{source.name}</strong><small>{source.address} · {source.updated}</small></div><label className="toggle"><input type="checkbox" checked={source.enabled} onChange={() => setSources(list => list.map(x => x.id === source.id ? { ...x, enabled: !x.enabled, updated: '刚刚修改' } : x))}/><span /></label></div>)}</div><h3>导入配置草稿</h3><p className="hint">示例：{`{"name":"我的已授权服务","address":"https://example.com/catalog"}`}</p><textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder={'粘贴 JSON；仅接受 name 与 address 字段'} /><button className="primary" onClick={importSource}>验证并保存为停用</button>{notice && <p className="notice">{notice}</p>}<hr/><h3>安全边界</h3><ul><li>仅接入你拥有访问权和再分发权的服务。</li><li>在启用网络请求前，建议增加域名允许列表、用户确认与审计日志。</li><li>不要收集或上传账户凭据、Cookie 或受保护内容。</li></ul></section>}
    </section>
  </main>
}

function Section({ title, children }: { title: string; children: ReactNode }) { return <section className="section"><h2>{title}</h2>{children}</section> }
