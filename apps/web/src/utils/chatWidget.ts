export const OPEN_CHAT_WIDGET_EVENT = 'pedroduartek:open-chat-widget'

export function openChatWidget() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(OPEN_CHAT_WIDGET_EVENT))
}
