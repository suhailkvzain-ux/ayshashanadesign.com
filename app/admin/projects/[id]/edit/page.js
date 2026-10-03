import ProjectEditor from '../../ProjectEditor';
export default async function EditProject({params}){const {id}=await params;return <ProjectEditor mode="edit" id={id}/>}
