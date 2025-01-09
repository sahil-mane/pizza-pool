import nextConnect from "next-connect"
import upload from '../../../libs/multer';

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  // File upload successful, you can handle the uploaded file here
  const file = req.file;
  if (file) {
    res.status(200).json({ success: true, file });
  } else {
    res.status(400).json({ success: false, message: 'No file uploaded' });
  }
});

export default apiRoute;                                


// export async function POST(req) {
//     const data = await req.formData();
//     if(data.get('file'))
//     {
//       // upload the file  
//     }
//     return Response.json(true);
// }