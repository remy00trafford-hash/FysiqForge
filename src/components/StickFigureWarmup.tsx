import React from "react";
import { WarmupPremiumAnimation } from "./WarmupPremiumAnimation";

type WarmupMove = "shoulders" | "jacks" | "chest";
interface StickFigureWarmupProps { move: WarmupMove; }

export const StickFigureWarmup: React.FC<StickFigureWarmupProps> = ({ move }) => (
  <WarmupPremiumAnimation move={move} />
);
