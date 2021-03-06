import './App.css';
import Header from "./components/Header"
import LoginPage from "./components/LoginPage"
import ShopPage from "./components/ShopPage"
import SellPage from "./components/SellPage"
import Cart from "./components/Cart"
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

function App() {

  const [ itemsArray, setItemsArray ] = useState([]);
  const [ displayedItems, setDisplayedItems ] = useState([]);
  const [ patchedEdit, setPatchedEdit ] = useState(false);
  const [ deletedItem, setDeletedItem ] = useState(false);
  const [ createdItem, setCreatedItem ] = useState(false);
  const [ userArr, setUserArr ] = useState([]);
  const [ selectUser, setSelectUser ] = useState({});
  const [ isAddedCart, setIsAddedCart ] = useState(false);
  const [ userCartItems, setUserCartItems ] = useState([]);
  const [ isCheckedOut, setIsCheckedOut ] = useState(false);
  const [ isDeletedCart, setIsDeletedCart ] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/items")
    .then(resp => resp.json())
    .then(itemsData => {
      setItemsArray(itemsData);
      setDisplayedItems(itemsData);
    })
  }, [patchedEdit, deletedItem, createdItem])

  function handleSearchSubmit(term) {
    let renderedItems = itemsArray.filter(item => item.itemName.toLowerCase().includes(term.toLowerCase()));
    setDisplayedItems(renderedItems);
  }

  function handleSubmitEdit(editedItem) {
    console.log(editedItem)
    fetch(`http://localhost:3000/items/${editedItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(editedItem)
    })
    .then(resp => resp.json())
    .then(data => setPatchedEdit(!patchedEdit))
  }

  function performDelete(deleteItemId) {
    fetch(`http://localhost:3000/items/${deleteItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(resp => resp.json())
    .then(data => setDeletedItem(!deletedItem))
  }

  function performAdd(newItem) {
    fetch("http://localhost:3000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newItem)
    })
    .then(resp => resp.json())
    .then(data => setCreatedItem(!createdItem))
  }

  useEffect(()=>{
    fetch("http://localhost:3000/users")
    .then(resp=> resp.json())
    .then(data => setUserArr(data))
  }, [isAddedCart, isCheckedOut, isDeletedCart])
 

  function handleUser(user){
    setSelectUser(user[0]);
    setUserCartItems(user[0].cartItems);
  }

  function performCartAdd(item) {
    fetch(`http://localhost:3000/users/${selectUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        ...selectUser,
        cartItems: [...userCartItems, item]
      })
    })
    .then(resp => resp.json())
    .then(data => {
      setUserCartItems([...userCartItems, item])
      setIsAddedCart(!isAddedCart)
    })
  }

  function performCheckout() {
    fetch(`http://localhost:3000/users/${selectUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        ...selectUser,
        cartItems: []
      })
    })
    .then(resp => resp.json())
    .then(data => {
      setUserCartItems([])
      setIsCheckedOut(!isCheckedOut)
    })
  }

  function performCartDelete(index) {
    fetch(`http://localhost:3000/users/${selectUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        ...selectUser,
        cartItems: userCartItems.slice(0, index).concat(userCartItems.slice(index + 1))
      })
    })
    .then(resp => resp.json())
    .then(data => {
      setUserCartItems(userCartItems.slice(0, index).concat(userCartItems.slice(index + 1)));
      setIsCheckedOut(!isDeletedCart);
    })
  }
  
  return (
    <div>
        <Header selectUser={selectUser} />
      <Switch>
        <Route path="/shop">
          <ShopPage 
            displayedItems={displayedItems} 
            handleSearchSubmit={handleSearchSubmit}
            performCartAdd={ performCartAdd }
          />
        </Route>
        <Route path="/sell">
          <SellPage 
            displayedItems={displayedItems} 
            handleSearchSubmit={handleSearchSubmit} 
            selectUser={selectUser} 
            handleSubmitEdit={handleSubmitEdit}
            performDelete={performDelete}
            performAdd={performAdd}
          />
        </Route>
        <Route path="/cart">
          <Cart selectUser={selectUser} 
            userCartItems={userCartItems} 
            performCheckout={performCheckout} 
            performCartDelete={performCartDelete}
          />
        </Route>
        <Route path="/">
          <LoginPage userArr={userArr} handleUser={handleUser}/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;