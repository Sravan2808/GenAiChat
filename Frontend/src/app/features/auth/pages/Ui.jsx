import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Meteors } from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import React from "react";
import { LuMessageCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Ui = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen w-full bg-[#0B2117]  overflow-hidden">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />
      <Meteors number={30} angle={215} />
      <div className="px-4 py-3  flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md flex-shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/40">
          <LuMessageCircle className="w-3.5 h-3.5 text-white" />
        </div >
        <div className="flex items-center justify-between w-full ">
        <span className="font-bold selection:bg-green selection:text-green-300 text-lg whitespace-nowrap bg-gradient-to-r from-white to-gray-100/80 bg-clip-text text-center tracking-tight text-transparent">
          S2 Chat
        </span>
        <button onClick={() => navigate("/login")} className="selection:text-green-300  cursor-pointer bg-gradient-to-br from-primary to-accent text-white py-2 px-4 rounded-md shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-shadow duration-200">
          Try Now
        </button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <h1 className="pointer-events-none bg-linear-to-b from-white to-gray-100/80 bg-clip-text text-center md:max-w-xl text-4xl md:text-8xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10">
          <AnimatedShinyText shimmerWidth={0}>
            Think. Type. Done. ⚡
          </AnimatedShinyText>
        </h1>
      </div>
    
    </div>
  );
};

export default Ui;
