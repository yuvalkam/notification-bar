const NOTIFICATIONS = [
  { id:1, type:'workspace', ws:'Nova Esports', avatar:'NE', color:'#9b5de5', title:'New task assigned to you', sub:'Match Preparation — due tomorrow', time:'2m ago',  unread:true  },
  { id:2, type:'chat',      ws:'',             avatar:'JK', color:'#00b4fc', title:'Jake Kim',                 sub:'yo you online? scrims at 9',        time:'5m ago',  unread:true  },
  { id:3, type:'workspace', ws:'Work Hub',     avatar:'WH', color:'#ff9500', title:'Meeting scheduled',        sub:'Sprint Review — today at 3pm',      time:'18m ago', unread:true  },
  { id:4, type:'chat',      ws:'',             avatar:'SR', color:'#f72585', title:'Sara R.',                  sub:'I sent the files over',              time:'1h ago',  unread:false },
  { id:5, type:'workspace', ws:'Nova Esports', avatar:'NE', color:'#9b5de5', title:'Luna mentioned you',       sub:'"@Alex check the strat doc"',        time:'2h ago',  unread:false },
  { id:6, type:'chat',      ws:'',             avatar:'DM', color:'#00f5d4', title:'Dev Meetup Group',         sub:'Event reminder: tomorrow 7pm',       time:'3h ago',  unread:false },
]

let activeTab = 'all'// tab

const wsSvg = `<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`
const chSvg = `<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`

function getFiltered() { //from where the notfi
  if (activeTab === 'all') return NOTIFICATIONS
  return NOTIFICATIONS.filter(n => n.type === activeTab)
}

function renderList() {
  const list = document.getElementById('notifList')
  const items = getFiltered()
  if (!items.length) {
    list.innerHTML = `<div style="padding:20px;text-align:center;font-size:11.5px;color:rgba(255,255,255,0.25)">No notifications</div>`
    return
  }
  list.innerHTML = items.map(n => `
    <div class="notif-item${n.unread ? ' unread' : ''}" data-id="${n.id}">
      <div style="position:relative;flex-shrink:0;">
        <div class="notif-av" style="background:${n.color}22;color:${n.color};border:1px solid ${n.color}44;">${n.avatar}</div>
        <div style="position:absolute;bottom:-1px;right:-1px;width:14px;height:14px;border-radius:50%;background:#13131f;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.08);">
          ${n.type === 'workspace' ? wsSvg : chSvg}
        </div>
      </div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-sub">${n.sub}</div>
        ${n.ws ? `<div class="notif-ws">${n.ws}</div>` : ''}
      </div>
      <div class="notif-meta">
        <span class="notif-time">${n.time}</span>
        ${n.unread ? '<div class="notif-dot"></div>' : ''}
      </div>
    </div>
  `).join('')

  list.querySelectorAll('.notif-item').forEach(el => {
    el.addEventListener('click', () => {
      const notif = NOTIFICATIONS.find(n => n.id === Number(el.dataset.id))
      if (notif) { notif.unread = false; renderList(); updateBadge() }
    })
  })
}

function updateBadge() { //dot
  const badge = document.getElementById('notifBadge')
  badge.classList.toggle('visible', NOTIFICATIONS.some(n => n.unread))
}

function init() {
  const navItem  = document.getElementById('notifNavItem')
  const dropdown = document.getElementById('notifDropdown')
  const markAll  = document.getElementById('notifMarkAll')

  navItem.addEventListener('click', e => { //open/close
    e.stopPropagation()
    const isOpen = dropdown.classList.toggle('open')
    if (isOpen) renderList()
  })

  document.addEventListener('click', () => dropdown.classList.remove('open')) //witch click close the tab
  dropdown.addEventListener('click', e => e.stopPropagation())

  document.querySelectorAll('.notif-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      activeTab = tab.dataset.tab
      renderList()
    })
  })

  markAll.addEventListener('click', () => {
    NOTIFICATIONS.forEach(n => n.unread = false)
    renderList()
    updateBadge()
  })

  updateBadge()
}

init()
