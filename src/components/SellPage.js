import React from "react";
import ItemsContainer from "./ItemsContainer";


function SellPage({ displayedItems, handleSearchSubmit, selectUser, handleSubmitEdit, performDelete, performAdd }){

  const buttonText= "Edit";

  const userSellItems = displayedItems.filter(item => item.itemCreator === selectUser.username)

  console.log(userSellItems);

  return(
    <div>
      <h1>
      </h1>
      <ItemsContainer 
        displayedItems={userSellItems} 
        buttonText={buttonText}
        handleClick={handleSubmitEdit}
        selectUser={selectUser}
        performDelete={performDelete}
        performAdd={performAdd}
      />
    </div>
  )
}

export default SellPage;