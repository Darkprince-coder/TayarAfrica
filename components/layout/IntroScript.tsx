import { INTRO_STORAGE_KEY } from "@/lib/motion-gate";

/**
 * Runs before first paint and decides whether the logo intro plays:
 * - only when a visit starts on the homepage (people arriving from search on a tour or
 *   destination page see that page straight away, and the intro is skipped for the rest of the
 *   visit);
 * - once per browser session (returning visitors are flagged so the loader never flashes);
 * - never with reduced motion.
 * A playing intro is flagged so page reveals wait for it. Must come after MotionScript, which sets
 * `data-motion`.
 */
export function IntroScript() {
  const key = JSON.stringify(INTRO_STORAGE_KEY);
  const code = `(function(){var d=document.documentElement;var home=location.pathname==="/";if(!home)d.setAttribute("data-intro-seen","");try{if(!home){sessionStorage.setItem(${key},"1")}else if(sessionStorage.getItem(${key})){d.setAttribute("data-intro-seen","")}else if(d.hasAttribute("data-motion")){d.setAttribute("data-intro-playing","")}}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
