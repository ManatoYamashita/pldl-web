'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from '../../about/page.module.css';

export default function MessageSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const accent = el.querySelector<HTMLElement>('[data-message-accent]');
      const subEn = el.querySelector<HTMLElement>('[data-message-sub-en]');
      const heading = el.querySelector<HTMLElement>('[data-message-heading]');
      const imageMobile = el.querySelector<HTMLElement>('[data-message-image-mobile]');
      const bodyParagraphs = el.querySelectorAll<HTMLElement>('[data-message-body-p]');
      const signature = el.querySelector<HTMLElement>('[data-message-signature]');
      const imageDesktop = el.querySelector<HTMLElement>('[data-message-image]');

      // Initial hidden state
      if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'left center' });
      const fadeUpTargets = [subEn, heading].filter(Boolean) as HTMLElement[];
      gsap.set(fadeUpTargets, { y: 20, opacity: 0 });
      if (imageMobile) gsap.set(imageMobile, { scale: 0.85, opacity: 0 });
      if (bodyParagraphs.length > 0) gsap.set(bodyParagraphs, { y: 20, opacity: 0 });
      if (signature) gsap.set(signature, { y: 20, opacity: 0 });
      if (imageDesktop) gsap.set(imageDesktop, { scale: 0.85, opacity: 0 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();
          const isDesktop = window.matchMedia('(min-width: 921px)').matches;

          // Accent bar: scaleX 0→1
          if (accent) {
            tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);
          }
          // SubEn ("Message")
          if (subEn) {
            tl.to(subEn, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.15);
          }
          // Heading ("代表のメッセージ")
          if (heading) {
            tl.to(heading, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.25);
          }
          // Mobile image (920px以下のみ表示)
          if (imageMobile && !isDesktop) {
            tl.to(
              imageMobile,
              { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
              0.35,
            );
          }
          // Body paragraphs (staggered)
          if (bodyParagraphs.length > 0) {
            tl.to(
              bodyParagraphs,
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.1,
              },
              isDesktop ? 0.35 : 0.55,
            );
          }
          // Signature (body完了後+0.1s)
          if (signature) {
            const bodyEnd =
              (isDesktop ? 0.35 : 0.55) + 0.5 + (bodyParagraphs.length - 1) * 0.1;
            tl.to(
              signature,
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              bodyEnd + 0.1,
            );
          }
          // Desktop image (920px超のみ)
          if (imageDesktop && isDesktop) {
            tl.to(
              imageDesktop,
              { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' },
              0.2,
            );
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
      );

      observer.observe(el);
      return () => observer.disconnect();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll<HTMLElement>(
        '[data-message-accent], [data-message-sub-en], [data-message-heading], [data-message-image-mobile], [data-message-body-p], [data-message-signature], [data-message-image]',
      );
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.messageSection}>
      <div className={styles.messageContainer}>
        <div className={styles.messageText}>
          <div className={styles.messageAccent} data-message-accent />
          <p className={styles.messageSubEn} data-message-sub-en>
            Message
          </p>
          <h2 className={styles.messageHeading} data-message-heading>
            代表のメッセージ
          </h2>
          <div className={styles.messageImageMobile} data-message-image-mobile>
            <Image
              src="/images/assets/matsushima-sakiko.webp"
              alt="代表理事 松島咲季子"
              width={280}
              height={280}
              className={styles.messageImageCircle}
              sizes="200px"
            />
          </div>
          <div className={styles.messageBody}>
            <p data-message-body-p>
              はじめてこどもたちとワークショップをした日、こどもたちは
              想像をはるかに超える創造力と好奇心で私を圧倒してくれました。
            </p>
            <p data-message-body-p>
              成長していく中で環境や一部の評価などを理由に
              学びからドロップアウトしてしまうこどもが多いのが現状です。
              しかし、私はあの日、すべてのこどもたちは平等に素晴らしい力を持っていて
              その力さえ引き出せれば、創造力と好奇心と、そして強い意志をもって
              未来を切り開いていくことができると実感しました。
            </p>
            <p data-message-body-p>
              私たちは、学ぶことは楽しい、知らないことを知ることは面白いことというポジティブな
              マインドをもったこどもを一人でも増やしたいという思いでこの事業を立ち上げました。
            </p>
            <p data-message-body-p>
              環境や経済状況に関わらず自らの力と意志で自分の未来を切り開いてくれるこどもが
              増えることを目指して私たちはこどもたちの「したい！」「知りたい！」を全力でサポートし続けます。
            </p>
          </div>
          <div className={styles.messageSignature} data-message-signature>
            <span className={styles.signatureRole}>代表理事</span>
            <span className={styles.signatureName}>松島咲季子</span>
          </div>
        </div>
        <div className={styles.messageImageWrap} data-message-image>
          <Image
            src="/images/assets/matsushima-sakiko.webp"
            alt="代表理事 松島咲季子"
            width={400}
            height={400}
            className={styles.messageImage}
            sizes="(max-width: 920px) 100vw, 350px"
          />
        </div>
      </div>
    </section>
  );
}
