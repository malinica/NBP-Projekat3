import { useParams } from 'react-router-dom';
//za id ucitaj estate dodao sam ovo samo da bih povezao na svoju stranicu 
export const EstatePage = () => {
  const { id } = useParams();

  return (<></>);
}
export default EstatePage;