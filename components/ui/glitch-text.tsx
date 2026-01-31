"use client";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <>
      <style jsx>{`
        .glitch-text {
          position: relative;
          display: inline-block;
          -webkit-text-stroke: 1px white;
          color: transparent;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
        }

        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #ff6600;
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }

        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #fff;
          animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% {
            clip: rect(31px, 9999px, 94px, 0);
          }
          20% {
            clip: rect(62px, 9999px, 42px, 0);
          }
          40% {
            clip: rect(16px, 9999px, 78px, 0);
          }
          60% {
            clip: rect(81px, 9999px, 13px, 0);
          }
          80% {
            clip: rect(95px, 9999px, 53px, 0);
          }
          100% {
            clip: rect(23px, 9999px, 86px, 0);
          }
        }

        @keyframes glitch-anim2 {
          0% {
            clip: rect(65px, 9999px, 100px, 0);
          }
          20% {
            clip: rect(12px, 9999px, 58px, 0);
          }
          40% {
            clip: rect(94px, 9999px, 32px, 0);
          }
          60% {
            clip: rect(45px, 9999px, 81px, 0);
          }
          80% {
            clip: rect(29px, 9999px, 15px, 0);
          }
          100% {
            clip: rect(78px, 9999px, 46px, 0);
          }
        }
      `}</style>
      <span className={`glitch-text ${className}`} data-text={text}>
        {text}
      </span>
    </>
  );
}
