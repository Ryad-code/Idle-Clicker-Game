import { useGameStore } from '../game/gameStore';
import { formatDecimal } from '../utils/formatters';
import { useEffect, useState } from 'react';
import { Unit } from '../game/core/types';
import { Card, CardContent } from '@/components/ui/pixelact-ui/card';

function Stats() {
  const points = useGameStore(state => state.points);
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const totalClicks = useGameStore(state => state.totalClicks);
  const createdAt = useGameStore(state => state.createdAt);
  const grid = useGameStore(state => state.grid);
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const updateDuration = () => {
      const elapsed = Date.now() - createdAt.getTime();
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      if (days > 0) {
        setDuration(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setDuration(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setDuration(`${minutes}m ${seconds}s`);
      } else {
        setDuration(`${seconds}s`);
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6 uppercase">Game Statistics</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="box-shadow-margin">
            <CardContent className="py-4">
              <div className="text-[10px] text-muted-foreground mb-2 uppercase">Game Duration</div>
              <div className="text-sm font-bold">{duration}</div>
            </CardContent>
          </Card>

          <Card className="box-shadow-margin">
            <CardContent className="py-4">
              <div className="text-[10px] text-muted-foreground mb-2 uppercase">Total Points Earned</div>
              <div className="text-sm font-bold">{formatDecimal(points)}</div>
            </CardContent>
          </Card>

          <Card className="box-shadow-margin">
            <CardContent className="py-4">
              <div className="text-[10px] text-muted-foreground mb-2 uppercase">Total Clicks</div>
              <div className="text-sm font-bold">{totalClicks.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="box-shadow-margin">
            <CardContent className="py-4">
              <div className="text-[10px] text-muted-foreground mb-2 uppercase">Points Per Second</div>
              <div className="text-sm font-bold">{formatDecimal(pointsPerSecond)}</div>
            </CardContent>
          </Card>

          <Card className="box-shadow-margin">
            <CardContent className="py-4">
              <div className="text-[10px] text-muted-foreground mb-2 uppercase">Click Value</div>
              <div className="text-sm font-bold">{formatDecimal(clickValue)}</div>
            </CardContent>
          </Card>

          <Card className="box-shadow-margin">
            <CardContent className="py-4">
              <div className="text-[10px] text-muted-foreground mb-2 uppercase">Total Units Owned</div>
              <div className="text-sm font-bold">{grid.flat().filter((u): u is Unit => u !== null).length.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Stats;