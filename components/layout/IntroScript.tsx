import { INTRO_STORAGE_KEY } from "@/lib/motion-gate";

/**
 * Runs before first paint: flags returning visitors so CSS can hide the loader at once, and
 * flags a first visit (with motion allowed) as "intro playing" so page reveals wait for it.
 * Must come after MotionScript, which sets `data-motion`.
 */
export function IntroScript() {
  const code = `try{var d=document.documentElement;if(sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)})){d.setAttribute("data-intro-seen","")}else if(d.hasAttribute("data-motion")){d.setAttribute("data-intro-playing","")}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
