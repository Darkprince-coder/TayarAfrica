/**
 * Runs before first paint. When the visitor has not asked for reduced motion it flags <html>
 * with `data-motion`, which lets CSS start reveal elements hidden so they can animate in
 * without a flash. If the page never hydrates (see MotionReady), the flag is removed after 6s
 * so no content can stay invisible.
 */
export function MotionScript() {
  const code = `try{var d=document.documentElement;if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-motion","");setTimeout(function(){if(!window.__tayariReady)d.removeAttribute("data-motion")},6000)}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
