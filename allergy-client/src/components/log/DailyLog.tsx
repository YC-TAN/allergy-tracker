import {
    Button,
    Typography
} from '@mui/material';
import { EditOutlined } from '@mui/icons-material';

interface DailyLogProps {
    onEditEntry: () => void,
}

const DailyLog = ({onEditEntry} : DailyLogProps) => {
  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
        <div className="text-center mb-6">
        <div
          aria-hidden="true"
          style={{
            width:        72,
            height:       72,
            borderRadius: '50%',
            background:   '#f0f7f0',
            border:       '2px solid #a5d6a7',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     32,
            margin:       '0 auto 1.25rem',
          }}
        >
          🌿
        </div>
        <Typography variant="h5" gutterBottom>
          A good day recorded!
        </Typography>
        <Typography variant="body2">
          Logged as no symptoms.<br />
        </Typography>
      </div>
              {/* Edit entry — goes back to CheckInPrompt */}
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        startIcon={<EditOutlined />}
        onClick={onEditEntry}
      >
        Actually, I do have symptoms...
      </Button>
    </div>
  )
}

export default DailyLog