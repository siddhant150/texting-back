const Users=[];

const addUsers=({id, name, room})=>{
	name=name.trim().toLowerCase();
	room=room.trim().toLowerCase();
	const existingUser=Users.find((user)=>user.room===room&&user.name===name);
	if(!name || !room) return { error: 'Username and room are required.' };
	if(existingUser) return { error: 'Username is taken.' };
	const user={id, name, room};
	Users.push(user);
	return {user};
}

const removeUser=(id)=>{
	const index=Users.findIndex((user)=>user.id===id);
	if(index!==-1){
		return Users.splice(index,1)[0];
	}
}

const getUsers=(id)=>Users.find((user)=>user.id===id);


const getUserInRoom=(room)=>Users.filter((user)=>user.room===room);

module.exports={addUsers, removeUser, getUsers, getUserInRoom};