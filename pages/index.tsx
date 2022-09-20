import type { NextPage } from "next";
import { Head } from "components/common";
import { useState } from "react";
import { utils } from "ethers";
import { UserProvider } from 'providers/UserProvider'
import Navbar from 'components/Navbar'
import AllProjects from 'components/AllProjects'
import FundedProjects from 'components/FundedProjects'

const Home: NextPage = () => {
  const [wallet, setWallet] = useState<string>();
  const [erc20Tokens, setErc20Tokens] = useState<string[]>([]);
  const [erc721Tokens, setErc721Tokens] = useState<string[]>([]);

  const filterCommaSeparatedAddresses = (str: string) =>
    str
      .split(",")
      .map((t) => t.trim())
      .filter(utils.isAddress);

  return (
    <UserProvider>
      <>
      <div>
        <Head/>

        <main>
          <Navbar />
          <section style={{ maxWidth: 800, margin: "0 auto" }}> 
          <FundedProjects />
          <AllProjects />
          </section>
          
        </main>
      </div>
      </>
    </UserProvider>
  );
};

export default Home;
