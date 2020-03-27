import React, { Component } from 'react';
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import {
  Header,
  Input,
  Grid,
  Button,
  Card
} from "semantic-ui-react"; 

class App extends Component {
 
  constructor(props) {
    super(props);
    this.state={
      dataApi:[],
      edit:false,
      dataPost:{
        id:0,
        nama_karyawan:'',
        jabatan:'',
        jenis_kelamin:'',
        tanggal_lahir:''
      }
    };
    this.handleRemove=this.handleRemove.bind(this);
    this.inputChange=this.inputChange.bind(this);
  }

  reloadData() {
    axios.get('http://localhost:3004/data-karyawan').then(res => {
      this.setState({
        dataApi: res.data,
        edit: false
      });
    });
  }

  handleRemove(e) {
    console.log(e.target.value)
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, {method:"DELETE"}).then(res=> this.reloadData());
  }

  inputChange(e) {
    let newdataPost = {...this.state.dataPost};

    if(this.state.edit === false) {
      newdataPost['id'] = new Date().getTime();
    }
    
    newdataPost[e.target.name] = e.target.value;

    this.setState(
      {
        dataPost : newdataPost
      },
      ()=>console.log(this.state.dataPost))
  }

  clearData = () => {
    let newdataPost = {...this.state.dataPost};

      newdataPost['id']="";
      newdataPost['nama_karyawan']="";
      newdataPost['jabatan']="";
      newdataPost['jenis_kelamin']="";
      newdataPost['tanggal_lahir']="";

      this.setState({
        dataPost : newdataPost
      })
  }

  onSubmitoForm=()=> {
    if(this.state.edit === false){
      axios.post(`http://localhost:3004/data-karyawan`, this.state.dataPost).then(()=>{
        
        this.reloadData();
        this.clearData();
      
      });
    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost).then(()=>{
        this.reloadData();
        this.clearData();
      })
    }
  }

  getDataId=(e)=>{
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then(res=>{
      this.setState({
        dataPost: res.data,
        edit: true
      })
    })
  }

  componentDidMount() {

    this.reloadData();

  }

  render() {
    return (
      <div>
        <br />
        <Header as='h2' dividing textAlign='center'>
          DATA KARYAWAN
        </Header>
        <br />
        
        <Grid>
          <Grid.Row>
            <Grid.Column width={1}></Grid.Column>

            <Grid.Column width={12}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Input 
                        action={{
                          color: 'teal',
                          icon: 'user',
                        }}
                        actionPosition='left'
                        type="text"
                        name="nama_karyawan"
                        value={this.state.dataPost.nama_karyawan}
                        placeholder='Nama Karyawan' 
                        onChange={this.inputChange}  
                        />
                    </td>
                    <td>
                      <Input 
                        action={{
                          color: 'teal',
                          icon: 'sitemap',
                        }}
                        actionPosition='left'
                        type="text"
                        name="jabatan"
                        value={this.state.dataPost.jabatan}
                        placeholder='Jabatan' 
                        onChange={this.inputChange}
                        />
                    </td>
                    <td>
                      <Input 
                        action={{
                          color: 'teal',
                          icon: 'genderless',
                        }}
                        actionPosition='left'
                        type="text" 
                        name="jenis_kelamin"
                        value={this.state.dataPost.jenis_kelamin}
                        placeholder='Jenis Kelamin' 
                        onChange={this.inputChange}
                        />
                    </td>
                    <td>
                      <Input 
                        type="date" 
                        name="tanggal_lahir"
                        value={this.state.dataPost.tanggal_lahir}
                      onChange={this.inputChange}
                      />
                    </td>
                    <td>
                      <Button type="submit" color='teal' onClick={this.onSubmitoForm}>Save</Button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <br />

              {this.state.dataApi.map((dat,index)=>
                {
                  return(
                    <div key={index}>
                      <Card>
                        <Card.Content>
                          <Card.Header>{dat.nama_karyawan}</Card.Header>
                          <Card.Meta>{dat.jabatan}</Card.Meta>
                          <Card.Description>
                            <p>Jenis Kelamin : <strong>{dat.jenis_kelamin}</strong></p>
                            <p>Tanggal Lahir : <strong>{dat.tanggal_lahir}</strong></p>
                          </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                          <div className='ui two buttons'>
                            <Button basic color='green' value={dat.id} onClick={this.getDataId}>
                              Edit
                            </Button>
                            <Button basic color='red' value={dat.id} onClick={this.handleRemove}>
                              Delete
                            </Button>
                          </div>
                        </Card.Content>
                      </Card>
                      <br />
                    </div>
                  );
                })}



            </Grid.Column>
    
            <Grid.Column width={1}></Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
        
      </div>
      );
  }
  
}

export default App;
