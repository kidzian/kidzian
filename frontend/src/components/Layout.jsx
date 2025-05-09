import React from 'react';
import Heading from './Heading';

const Layout = ({ children }) => {
  return (
    <>
      <Heading/>
      <main className="pt-[12.5vh]">
        {children}
      </main>
    </>
  );
};

export default Layout;
