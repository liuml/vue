/**
 * rem手机屏幕适配
 */
export default function (designWidth, rem2px) {
  let d = window.document.createElement('div')
  let head = window.document.getElementsByTagName('head')[0]
  d.style.width = '1rem'
  d.style.display = 'none'
  head.appendChild(d)
  let defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'))
  d.remove()
  document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%'
  let st = document.createElement('style')
  let portrait = '@media screen and (min-width: ' + window.innerWidth + 'px) {html{font-size:' + ((window.innerWidth / (designWidth / rem2px) / defaultFontSize) * 100) + '%}}'
  let landscape = '@media screen and (min-width: ' + window.innerHeight + 'px) {html{font-size:' + ((window.innerHeight / (designWidth / rem2px) / defaultFontSize) * 100) + '%}}'
  st.innerHTML = portrait + landscape
  head.appendChild(st)
  return defaultFontSize
}
