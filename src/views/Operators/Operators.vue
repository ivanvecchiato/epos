<template>
   <div>
      <el-container>
         <el-aside width="200px">
            <el-button type="danger" plain @click="newOperator">{{$t('config.new-operator')}}</el-button>
            <ul>
               <li v-for="op, index in operators" :key="op.id" @click="selectOperator(op, index)">
                  <el-icon :size="18" color="#e83c3c" style="vertical-align: middle;" v-if="op.admin">
                     <star />
                  </el-icon>
                  {{op.name}}
               </li>
            </ul>
         </el-aside>
         <el-main>
            <h1 v-if="currentOperator == null">{{$t('config.select-operator')}}</h1>
            <div v-else class="permissions">
               <div>
               <el-row :gutter="10" align="middle">
                  <el-col :span="8">
                     <el-input v-model="currentOperator.name" placeholder="name"></el-input>
                  </el-col>
                  <el-col :span="8">
                     <el-input v-model="currentOperator.pin" placeholder="PIN code"></el-input>
                  </el-col>
                  <el-col :span="8">
                     <el-checkbox label="admin" v-model="currentOperator.admin" @change="setAdmin"></el-checkbox>
                  </el-col>
               </el-row>
               </div>
               <ul>
                  <li v-for="p in currentOperator.permissions" :key="p.id">
                     <span>
                        <el-checkbox
                           :label="$t('permission.' + p.name)"
                           v-model="p.enabled">
                        </el-checkbox>
                     </span>
                  </li>
               </ul>

               <el-button type="primary" plain @click="saveOperator">{{$t('generic.save')}}</el-button>
            </div>
         </el-main>
      </el-container>
   </div>
</template>

<script>
import Firebase from "../../firebase.js";
import { Star } from '@element-plus/icons'
import Operator from "../../data/Operator.js"

export default {
   data() {
      return {
         operators: [],
         docIds: [],
         currentOperator: null,
         currentIndex: -1
      }
   },
   components: {Star},
   methods: {
      setAdmin: function(value) {
         this.currentOperator.admin = value;
         if(value == true) {
            for(var i=0; i<this.currentOperator.permissions.length; i++) {
               this.currentOperator.permissions[i].enabled = true;
            }
         }
      },
      confirmMsg(msg) {
         this.$message({
            message: msg,
            type: 'success',
         })
      },
      errorMsg(msg) {
         this.$message({
            message: msg,
            type: 'error',
         })
      },
      saveOperator: function() {
         var self = this;
         if(this.currentOperator.id == 0) {
            // get max id
            var max = 1;
            for(var i=0; i<this.operators.length; i++) {
               if(max<this.operators[i].id) max = this.operators[i].id;
            }
            max++;
            this.currentOperator.save(max)
         } else {
            this.currentOperator.update(
               this.docIds[this.currentIndex],
               function() {
                  self.$message({
                     message: self.confirmMsg(self.$t('config.changes-saved')),
                     type: 'success',
                  })
               },
               function() {
                  self.$message({
                     message: self.errorMsg(self.$t('config.changes-fail')),
                     type: 'error',
                  })
               }
            );
         }
      },
      newOperator: function() {
         this.currentOperator = new Operator;
         console.log('newOperator', this.currentOperator)
      },
      selectOperator: function(op, index) {
         this.currentOperator = op;
         this.currentIndex = index;
      },
      fillPermissions () {
         for(var i=0; i<this.operators.length; i++) {
            var op = this.operators[i];
            op.checkPermissions();
         }
      },
      loadOperators () {
         Firebase.db
           .collection("operators")
           .orderBy("id")
           .onSnapshot((snapshotChange) => {
             this.operators = [];
             this.docIds = [];
             snapshotChange.forEach((doc) => {
               var record = new Operator;
               record.fillData(doc.data());
               this.operators.push(record);
               this.docIds.push(doc.id);
             });
             this.fillPermissions();
            });
         },
   },
   mounted() {
      this.loadOperators()
   },
}
</script>
<style scoped>
ul {
  list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;
}
ul li {
   margin: 15px;
	padding: .5em 0;
	border-bottom: 1px solid #CCC;
   text-align: left;
}
ul li:last-child {
	border-bottom: 0;
}
.permissions {
   padding: 10px;
}

</style>