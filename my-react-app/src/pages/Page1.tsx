import Body from "../components/Layout/Body";
import { Button } from '@mui/material';
import { Card, CardContent, Typography } from '@mui/material';

function Page1() {

  function handleClick() {
    alert('Button clicked!'); // or do anything here
  }

  return (
    <Body>
      <Card style={{ maxWidth: 320, margin: '24px auto', padding: 16 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Hello, Rev
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a basic Material UI card.
        </Typography>
      </CardContent>
    </Card>
        <Button variant="contained" color="primary" onClick={handleClick}>
        Click Me
      </Button>
    </Body>
  )
}

export default Page1