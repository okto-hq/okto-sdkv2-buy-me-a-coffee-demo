import Okto from '../assets/okto.svg';

const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-screen py-2 flex justify-center items-center bg-[#EDEDED] text-black ">
      <div className="flex justify-center items-center container mx-auto text-center gap-x-2">
        <p>Powered by</p> <img src={Okto} className="w-8 h-8" />
      </div>
    </footer>
  );
}
export default Footer;