import MediaEditor from '../../../MediaEditor';
export default async function EditRender({params}){const {id}=await params;return <MediaEditor kind="renders" id={id}/>}
