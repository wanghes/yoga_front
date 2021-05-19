<template>
    <div class="hello">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAddRoom">新建教室</el-button>
            </el-button-group>
        </div>

        <el-table :data="rooms">
            <el-table-column prop="name" width="400" label="教室名称"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="fixRoom(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteRoom(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="创建教室" :visible.sync="visible">
            <el-form :model="form">
                <el-form-item required label="教室名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="operateRoom">完 成</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
const room = require("@/api/room")
export default {
	name: "RoomIndex",
	inject: ["reload"],
	data() {
		return {
			formLabelWidth: "120px",
			rooms: [],
			visible: false,
			form: {
				id: "",
				name: "",
			},
		}
	},
	mounted() {
		this.fetData()
	},
	methods: {
		async fetData() {
			let res = await room.getRooms()
			this.rooms = res.data
		},
		toAddRoom() {
			this.visible = true
		},
		async fixRoom(row) {
			this.visible = true
			let res = await room.getRoom({
				id: row.id,
			})
			let data = res.data

			this.form = {
				id: data.id,
				name: data.name,
			}
		},
		async operateRoom() {
			let isEdit = false

			if (!this.form.name) {
				this.$message.error("请填写教室名称")
				return
			}

			if (this.form.id) {
				isEdit = true
			}

			let res = null
			if (isEdit) {
				res = await room.renameRoom({
					id: this.form.id,
					name: this.form.name,
				})
			} else {
				res = await room.addRoom({
					name: this.form.name,
				})
			}

			this.reload()

			this.visible = false
			let id = res.data.insertId
			if (id) {
				this.$message.success("操作成功")
			}
		},
		async deleteRoom(row) {
			let res = await room.deleteRoom({
				id: row.id,
				name: this.form.name,
			})
			if (res) {
				this.$message.success("操作成功")
				this.reload()
			}
		},
	},
}
</script>

<style scoped>
.btn_wrap {
	padding-bottom: 20px;
}
.cover {
	width: 120px;
}
.label {
	color: #666;
	font-weight: normal;
}
.top_info {
	display: flex;
	justify-content: space-between;
}
.right_search {
	display: flex;
	align-items: center;
	position: relative;
	top: -10px;
}
.input_search {
	display: inline-block;
	width: 230px;
	margin-left: 15px;
}
.el-dropdown-link {
	margin-right: 10px;
}
</style>
