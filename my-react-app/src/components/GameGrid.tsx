import React from "react";
import styled from "styled-components";


export const GRID_ROWS = 10;
export const GRID_COLS = 10;

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(${GRID_ROWS}, 32px);
  grid-template-columns: repeat(${GRID_COLS}, 32px);
  gap: 4px;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  width: max-content;
`;

const GridCell = styled.div`
  width: 32px;
  height: 32px;
  background: #e0e0e0;
  border-radius: 4px;
  border: 1px solid #ccc;
`;


import { UNIT_CONFIG } from "../game/config/units";
import type { Unit } from "../game/core/types";
import { GridUnitCard } from "../styles/components/unitPanel.styles";

interface GameGridProps {
  grid: (Unit | null)[][];
}

const GameGrid: React.FC<GameGridProps> = ({ grid }) => (
  <GridContainer>
    {grid.flat().map((unit, i) =>
      unit ? (
        <GridUnitCard key={unit.id} $color={UNIT_CONFIG[unit.type].color} title={UNIT_CONFIG[unit.type].name}>
          {UNIT_CONFIG[unit.type].emoji}
        </GridUnitCard>
      ) : (
        <GridCell key={i} />
      )
    )}
  </GridContainer>
);

export default GameGrid;
