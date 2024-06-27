"use client";

import React from "react";
import { motion, useScroll } from "framer-motion";

type Props = {};

const NavScrollProgress = (props: Props) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="progress-bar fixed top-[50px] z-[40] left-0 right-0 h-[1px] bg-primary"
      style={{ transformOrigin: "0%", scaleX: scrollYProgress }}
    />
  );
};

export default NavScrollProgress;