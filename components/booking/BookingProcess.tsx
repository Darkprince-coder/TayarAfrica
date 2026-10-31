import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Container, Section } from "@/components/ui/Section";
import type { BookingPolicy } from "@/lib/content/types";
import styles from "./BookingProcess.module.css";

/** From request to travel, in four plain steps, plus the cancellation terms. Numbers come from site settings. */
export function BookingProcess({ booking }: { booking: BookingPolicy }) {
  const methods = booking.paymentMethods.join(", ").replace(/, ([^,]*)$/, " or $1");
  const steps = [
    { title: "You send a request", text: "This form, an email or a WhatsApp message. Nothing is booked yet and there is nothing to pay." },
    { title: "We send a quote", text: "A route, places to stay and a written price that says what is included. Change anything you like." },
    {
      title: `A ${booking.depositPercent}% deposit confirms it`,
      text: `When you are happy, pay the deposit by ${methods}. We then book everything and confirm in writing.`,
    },
    { title: `The balance is paid ${booking.balanceDue}`, text: "You travel knowing who meets you, with our WhatsApp line open day and night." },
  ];

  return (
    <Section tone="sand" labelledBy="process-title">
      <Container>
        <div className={styles.layout}>
          <div className={styles.head}>
            <Reveal variant="fade">
              <p className={styles.kicker}>How booking works</p>
            </Reveal>
            <RevealText as="h2" id="process-title" className={styles.heading} text="From a request *to the road.*" delay={120} />
          </div>

          <ol role="list" className={styles.steps}>
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 110} className={styles.step}>
                <span className={styles.no} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={styles.title}>{s.title}</h3>
                  <p className={styles.text}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className={styles.policy}>
            <h3 className={styles.policyTitle}>If you need to cancel</h3>
            <dl className={styles.tiers}>
              {booking.cancellation.map((c) => (
                <div key={c.when} className={styles.tier}>
                  <dt>{c.when}</dt>
                  <dd>{c.refund}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.policyLinks}>
              Full details in our <Link href="/cancellation">Cancellation and Refund Policy</Link> and <Link href="/terms">Terms of Service</Link>.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
