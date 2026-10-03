import MediaEditor from '../../../MediaEditor';
export default async function EditDrawing({params}){const {id}=await params;return <MediaEditor kind="drawings" id={id}/>}
