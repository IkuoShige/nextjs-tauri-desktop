"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * シンプルなカウンターコンポーネント
 * 増加・減少・リセット機能を提供します
 */
export function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">カウンター</h2>
      
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <span className="text-5xl font-semibold">{count}</span>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={decrement} className="flex-1">
          減らす
        </Button>
        <Button variant="outline" onClick={reset} className="flex-1">
          リセット
        </Button>
        <Button onClick={increment} className="flex-1">
          増やす
        </Button>
      </div>
    </div>
  );
} 