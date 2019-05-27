import React from 'react';
import axios from "axios";
import {Container, ListGroup,ListGroupItem,Button} from 'reactstrap';
import {CSSTransition,TransitionGroup} from 'react-transition-group';
export default class ShoppingList extends React.Component{
	state={
		items:[
		{id:Number},
		]
	}
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 2000);
      this.setState({ intervalIsSet: interval });
    }
  }	

    componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("http://localhost:5000/"||process.env.baseURL)
      .then(data => data.json())
      .then(res => this.setState({ items: res.data }));
  };

  postDataToDb =(name)=>{
  	      let currentIds=this.state.items.map(items=>items.id);
      let idToBeAdded=0;
      while(currentIds.includes(idToBeAdded)){
        ++idToBeAdded;
      }
  	axios.post("http://localhost:5000/"||process.env.baseURL,{
  		id:idToBeAdded,
  		name:name
  	});
  };

  deleteData=(id)=>{
  	axios.delete("http://localhost:5000/"||process.env.baseURL,{
  		      data: {
        id: id
      }
  	})
  }
  
	render(){
		const { items,id } = this.state;
		if(items)//to check if DB ==null
		return(
			<Container>
				<Button
				color="dark"
				style={{marginBottom:'2rem'}}
				onClick={() => {
					const name = prompt('Enter Item');
					if(name){
						this.postDataToDb(name);
					}
				}}
				>
				Add Item
				</Button>
				<ListGroup>
					<TransitionGroup className="shopping-list">
					{items.map(({id,name})=>(
						<CSSTransition key={id} timeout={80} classNames="fade">
					<ListGroupItem>
					<Button
					className="remove-btn"
					color="danger"
					size="sm"
					onClick={()=>this.deleteData(id)}
					>
					&times;
					</Button>
					{name}
					</ListGroupItem>
					</CSSTransition>
					))} 
					</TransitionGroup>
				</ListGroup>
			</Container>
			);
	}
}