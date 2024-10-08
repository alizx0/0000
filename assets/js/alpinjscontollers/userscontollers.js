document.addEventListener('alpine:init', () => {
    Alpine.data('usersData', function(){
        return {
            mainUsers: [],
            users: [],
            pageUsers: [],
            isLoading: false,
            showAddModal: false,
            pageCount: 1,
            itemsCount: 4,
            currentPage: 1,
            searchChar:"",
            newUserInfo:{
                name:"",
                username:"",
                email:"",
            },
            userIdToEdit: null,
            getUsers(){
                this.isLoading = true
                axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                    this.mainUsers = res.data
                    this.users = res.data
                    this.pagination()
                }).finally(()=>{
                    this.isLoading = false
                })
            },
            pagination(){
                this.pageCount = Math.ceil(this.users.length / this.itemsCount)
                const start = (this.currentPage * this.itemsCount) - this.itemsCount
                const end = this.currentPage * this.itemsCount
                this.pageUsers = this.users.slice(start,end)
            },
            nextPage(){
                this.currentPage++ 
                if (this.currentPage > this.pageCount) this.currentPage = this.pageCount
                this.pagination()
            },
            prevPage(){
                this.currentPage--
                if (this.currentPage < 1) this.currentPage = 1
                this.pagination()
            },
            handleChangeItemsCount(e){
                this.itemsCount = e.value
                if (this.itemsCount < 1) this.itemsCount = 1
                if (this.itemsCount > this.users.length) this.itemsCount = this.users.length
                this.pagination()
            },
            handleSearch(e){
                setTimeout(()=>{
                    this.users = this.mainUsers.filter(user=>(user.name.includes(e.value) || user.
                    username.includes(e.value) || user.email.includes(e.value)))
                    this.currentPage = 1
                    this.pagination()
                },100)
            },
            handleSubmitAddUserForm(){
                this.isLoading = true
                axios.post("https://jsonplaceholder.typicode.com/users", this.newUserInfo).then
                ((res)=>{
                    if (res.status = 201) {
                        this.mainUsers.push(res.data)
                        this.shiwAddModel= false
                        this.handleResetForm()
                        this.pagination()
                        M.toast({html: 'User is added', classes: 'rounded green'})
                    }
                }).finally(()=>{
                    this.isLoading = false
                })
            },
            handleResetForm(){
                this.newUserInfo = {
                    name:"",
                    username:"",
                    email:"",
                }
            },
            handleDeletUser(user){
                var toastHTML = '<span>Are you sure? ('+user.id+')</span><button class="btn-flat toast-action" x-on:click="handleConfirmDeleteUser('+user.id+')">Delete</button>';
                M.toast({html: toastHTML});
            },
            handleConfirmDeleteUser(userId){
                this.isLoading = true
                axios.delete("https://jsonplaceholder.typicode.com/users/"+userId).then((res)=>{
                    if (res.status === 200) {
                        this.mainUsers = this.mainUsers.filter(user=>user.id != userId)
                        this.users = this.users.filter(user=>user.id != userId)
                        this.pagination()
                        M.toast({html: 'User deleted successfully...', classes: 'green'})
                    }
                }).finally(()=>{
                    this.isLoading = false
                })
            },
            handleUpdateUser(user){
                axios.get("https://jsonplaceholder.typicode.com/users/"+user.id).then(res=>{
                    if(res.status = 200){
                        this.newUserInfo={
                            name:res.data.name,
                            username:res.data.username,
                            email:res.data.email,
                        }
                        this.userIdToEdit = res.data.id
                    }
                })
                this.showAddModal = true
            },
            handleConfirmEditUser(){
                axios.put("https://jsonplaceholder.typicode.com/users/"+this.userIdToEdit, this.newUserInfo).then
                ((res)=>{
                    if (res.status = 200) {
                        const userIndex = this.mainUsers.findIndex(user=>user.id = this.userIdToEdit)
                        this.mainUsers[userIndex] = res.data
                        // this.mainUsers.push(res.data)
                        this.shiwAddModel= false
                        this.handleResetForm()
                        this.userIdToEdit = null
                        this.pagination()
                        M.toast({html: 'User is updated', classes: 'green'})
                    }
                }).finally(()=>{
                    this.isLoading = false
                })
            }
        }
    })
})