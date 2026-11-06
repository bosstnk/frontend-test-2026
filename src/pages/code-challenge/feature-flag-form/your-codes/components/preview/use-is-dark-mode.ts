import { useSyncExternalStore } from 'react'

// ธีมอยู่ที่ class "dark" บน <html> (ใส่โดย theme-toggle.tsx และสคริปต์ใน __root.tsx) จึงฟังการเปลี่ยน class
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

const isDarkInBrowser = () =>
  document.documentElement.classList.contains('dark')

// server ไม่มี document: ถือว่าสว่างไปก่อน หลัง hydrate React อ่านค่าจริงเอง
const isDarkOnServer = () => false

export function useIsDarkMode(): boolean {
  return useSyncExternalStore(subscribe, isDarkInBrowser, isDarkOnServer)
}
