/**
 * 浏览器通知工具 - 用于检测新文章并通过标题闪烁和声音提醒用户
 */

// 存储通知相关状态
let isNotificationEnabled = false
let lastArticleCount = 0
let pollInterval: number | null = null
let titleFlashInterval: number | null = null
let originalTitle = document.title

// 通知声音 - 使用系统提示音
const NOTIFICATION_SOUND_URL = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQQSYafJ5MtvEwU+g7HJ2XsVEjZYm8POgnIcIFSBscnJgmcxMFaMs8S0ckoIEFeVv8qxdkMKDluZv8qxdEQMDl2av8qxckUMD16bv8qxcUUND1+cv8qxcEUNEGCdv8qxbkUNEGGev8qxbUUNEWKfv8qxa0UNEmOgv8qwaUQOEmShv8uwZ0QOE2Whv8uvZUMPE2aiv8uuY0MPFGeiv8utYUIPFWiiv8usX0EPFmmiv8urXUAPF2mjv8uqW0APGGqjv8upWD8PGWujv8uoVj4PGmyjv8unVD0PG22kv8umUjwPHG6kv8ulUDsPHW+kv8ukTjoPHnClv8ujTDkPH3Glv8uiSjgPIHKlv8uhSDcPIXOlv8ugRjYPInSlv8ufRDUPI3Wmv8ueQjQPJHamv8udQDMPJXemv8ucPjIPJnimv8ubPDEPJ3mmv8uaOjAPKHqmv8uZOC8PKXunv8uYNi4PKnynv8uXNCwPK32nv8uWMisQLH6nv8uVMCoPLX+nv8uULigPLoConsuTLCcPL4KonsuSKiYPMIOonsuRKCUQMYSonsuQJiQQMoWonsuPJCMQM4aonsuOIiIQNIeonsucGxsOBxA3Y4qqs4xXKSQXPXaYq6R8ND4nOYOgo5BdFAoWRYSjqKJ7Nhw6XZmtvKFgGwY7e6i3rIxAAgBNlrjCqHkyBgJgpMS+lk0DHl+nyr6BRwMKYZ/MyXxAAQtpotPPhzkGD3Kj0tSCSgIBZp7R1Y5KBwNqntDVlFIIAmuezdWXVwwDbJzL1JxfDwNtm8rUnGQSA26bytOcaRUCb5nI0p1uGAJwl8bRn3MbAXGVxdGgdx4BcpPE0KF8IQFzkcLPoYEkAXOPwM6hhi0AAAAAAAAAAAAAAAAAc47AzqGILQB0j8LQoXkfAXSRw9GheR8BdJLD0aF5HwFzkcPRoXkfAXORxNGheR8BcpDE0aF5HwFykMTRoXkfAXKQxNGheR8BcpDE0aF5HwFykMTRoXkfAXKQxNGheR8BcpDE0aF5HwFykMTRoXkfAXKQxNGheR8BcpDE0aB5HwFykMTRoHkfAXKQxNGgeR8BcpDE0aB5HwFykMTQoHkfAXKQxNCgeR8BcpDE0KB5HwFykMTQoHkfAXKQxNCgeR8BcpDE0KB5HwFykMTQoHkfAXKQxNCgeR8BcpDE0KB5HwFykMTQoHkfAXKQxNCgeB8BcpDE0KB4HwFykMPQoHgfAXKQw9CgeB8BcpDD0KB4HwFykMPQoHgfAXKQw9CgeB8BcpDD0KB4HwFykMPQoHgfAXKQw9CgeB8BcpDD0KB4HwFykMPQoHgfAXKQw9CgeB8BcpDD0KB4HwFykMPQoHgfAXKQw9CgeB8BcpDD0KB4HwFykMPQoHgfAXKQw9CgdxgB'

// 创建音频元素
let audioElement: HTMLAudioElement | null = null

/**
 * 获取通知启用状态
 */
export function getNotificationEnabled(): boolean {
  // 从localStorage恢复状态
  const saved = localStorage.getItem('browserNotificationEnabled')
  if (saved !== null) {
    isNotificationEnabled = saved === 'true'
  }
  return isNotificationEnabled
}

/**
 * 播放通知声音
 */
function playNotificationSound() {
  try {
    if (!audioElement) {
      audioElement = new Audio(NOTIFICATION_SOUND_URL)
      audioElement.volume = 0.5
    }
    audioElement.currentTime = 0
    audioElement.play().catch(e => {
      console.warn('无法播放通知声音:', e)
    })
  } catch (e) {
    console.warn('播放声音失败:', e)
  }
}

/**
 * 开始标题闪烁
 */
function startTitleFlash(newCount: number) {
  if (titleFlashInterval) {
    clearInterval(titleFlashInterval)
  }
  
  originalTitle = document.title.replace(/^\【.*?\】/, '')
  let isFlashing = false
  
  titleFlashInterval = window.setInterval(() => {
    if (isFlashing) {
      document.title = originalTitle
    } else {
      document.title = `【${newCount}篇新文章】${originalTitle}`
    }
    isFlashing = !isFlashing
  }, 1000)
  
  // 5秒后停止闪烁，保持显示新文章提示
  setTimeout(() => {
    stopTitleFlash()
    document.title = `【${newCount}篇新文章】${originalTitle}`
  }, 10000)
}

/**
 * 停止标题闪烁
 */
function stopTitleFlash() {
  if (titleFlashInterval) {
    clearInterval(titleFlashInterval)
    titleFlashInterval = null
  }
}

/**
 * 重置标题
 */
export function resetTitle() {
  stopTitleFlash()
  document.title = originalTitle || 'WeRSS'
}

/**
 * 检查新文章
 */
async function checkForNewArticles() {
  try {
    // 动态导入避免循环依赖
    const { getArticles } = await import('@/api/article')
    
    // @ts-ignore - page/pageSize 会被内部转换为 offset/limit
    const response = await getArticles({ page: 0, pageSize: 1 } as any)
    const currentTotal = response?.total || 0
    
    if (lastArticleCount > 0 && currentTotal > lastArticleCount) {
      const newCount = currentTotal - lastArticleCount
      console.log(`检测到 ${newCount} 篇新文章`)
      
      // 播放声音
      playNotificationSound()
      
      // 标题闪烁
      startTitleFlash(newCount)
      
      // 发送浏览器通知（如果用户授权）
      if (Notification.permission === 'granted') {
        new Notification('WeRSS - 新文章通知', {
          body: `检测到 ${newCount} 篇新文章`,
          icon: '/logo.svg'
        })
      }
    }
    
    lastArticleCount = currentTotal
  } catch (e) {
    console.warn('检查新文章失败:', e)
  }
}

/**
 * 启用浏览器通知
 */
export async function enableBrowserNotification(): Promise<boolean> {
  try {
    // 请求浏览器通知权限
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
    
    // 初始化文章计数
    const { getArticles } = await import('@/api/article')
    // @ts-ignore - page/pageSize 会被内部转换为 offset/limit
    const response = await getArticles({ page: 0, pageSize: 1 } as any)
    lastArticleCount = response?.total || 0
    
    // 开始定时检查（每60秒检查一次）
    if (pollInterval) {
      clearInterval(pollInterval)
    }
    pollInterval = window.setInterval(checkForNewArticles, 60000)
    
    isNotificationEnabled = true
    localStorage.setItem('browserNotificationEnabled', 'true')
    
    console.log('浏览器通知已启用，当前文章数:', lastArticleCount)
    return true
  } catch (e) {
    console.error('启用浏览器通知失败:', e)
    return false
  }
}

/**
 * 禁用浏览器通知
 */
export function disableBrowserNotification() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
  
  stopTitleFlash()
  resetTitle()
  
  isNotificationEnabled = false
  lastArticleCount = 0
  localStorage.setItem('browserNotificationEnabled', 'false')
  
  console.log('浏览器通知已禁用')
}

/**
 * 切换浏览器通知状态
 */
export async function toggleBrowserNotification(): Promise<boolean> {
  if (isNotificationEnabled) {
    disableBrowserNotification()
    return false
  } else {
    return await enableBrowserNotification()
  }
}

/**
 * 初始化浏览器通知（页面加载时调用）
 */
export function initBrowserNotification() {
  const saved = localStorage.getItem('browserNotificationEnabled')
  if (saved === 'true') {
    enableBrowserNotification()
  }
}
