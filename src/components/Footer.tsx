/** @format */

import Okto from "../assets/okto.svg";

const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full py-2 bg-[#EDEDED] text-black sticky">
      <div className="flex justify-center items-center gap-x-2">
        <p>Powered by</p>
        <img src={Okto} className="w-8 h-8" alt="Okto logo" />
      </div>
    </footer>
  );
};

export default Footer;
