import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
////////////////////////////////////////////
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deepOrange } from "@mui/material/colors";
import { Button, Container } from "@mui/material";
///////////////////////////////////////////////
import { toast } from "sonner";

export default function UserCard(props) {
  const { item, onDelete } = props;
  const { _id } = item;
  // const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345, minWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: deepOrange[500] }}
            alt={item.name}
            src={item.image}
          />
        }
        action={
          <>
            <IconButton
              aria-label="edit"
              LinkComponent={Link}
              to={`/manage/${item._id}/edit`}
            >
              <EditIcon />
            </IconButton>
            {/* prevent admin deleting themselves */}
            {item.role !== "admin" ? (
              <IconButton
                aria-label="delete"
                onClick={() => {
                  onDelete(_id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </>
        }
        title={item.name}
        subheader={item.role}
      />
      <CardContent>
        <Button
          variant="outlined"
          sx={{ color: "deepskyblue" }}
          fullWidth
          onClick={() => navigate("/profile/:_id")}
        >
          VIEW
        </Button>
      </CardContent>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
