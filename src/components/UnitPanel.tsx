import Grid from "./Grid";
import { Card } from "./ui/pixelact-ui/card";

function UnitPanel() {
  return (
    <Card className="box-shadow-margin m-2 p-6 overflow-y-auto overflow-x-hidden flex justify-center">
      <Grid />
    </Card>
  );
}

export default UnitPanel;