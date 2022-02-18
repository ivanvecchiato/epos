<template>
   <div>
      <div class="output">
         <div class="outputCalc">{{ calculatorValue || 0 }}</div>
      </div>
      <div class="buttons">
         <div
           class="button"
           v-for="n in btnArr"
           :key="n"
           :class="{ operator: ['C', '*', '/', '-', '+', '%', '='].includes(n) }">

           <div class="btn" @click="action(n)">
             {{ n }}
           </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   data() {
      return {
         calculatorValue: "",
         btnArr: [
            "7",
            "8",
            "9",
            "4",
            "5",
            "6",
            "1",
            "2",
            "3",
            "0",
            ".",
            "C",
         ],
         operator: null,
         previousCalculatorValue: "",
      }
   },
   methods: {
      action(n) {
         /* Append value */
         if (!isNaN(n) || n === ".") {
           this.calculatorValue += n + "";
         }
         /* Clear value */
         if (n === "C") {
           this.calculatorValue = "";
         }
         /* Percentage */
         if (n === "%") {
           this.calculatorValue = this.calculatorValue / 100 + "";
         }
         /* Operators */
         if (["/", "*", "-", "+"].includes(n)) {
           this.operator = n;
           this.previousCalculatorValue = this.calculatorValue;
           this.calculatorValue = "";
         }
         /* Calculate result using the eval function */
         if (n === "=") {
           this.calculatorValue = eval(
             this.previousCalculatorValue + this.operator + this.calculatorValue
           );
           this.previousCalculatorValue = "";
           this.operator = null;
         }
      },
   },
   mounted() {
      
   },
}
</script>

<style scoped>
.output {
  text-align: right;
  background-color: #e9817754;
  width: min(320px, 90%);
  margin: 10px auto;
  padding: 10px;
  border: 0.5px solid #e98077;
  border-radius: 4px;
  box-shadow: 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.008),
    6.7px 6.7px 5.3px rgba(0, 0, 0, 0.012),
    12.5px 12.5px 10px rgba(0, 0, 0, 0.015),
    22.3px 22.3px 17.9px rgba(0, 0, 0, 0.018),
    41.8px 41.8px 33.4px rgba(0, 0, 0, 0.022),
    100px 100px 80px rgba(0, 0, 0, 0.03);
}
.outputCalc {
  background-color: #e98177dc;
  padding: 5px;
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  border-radius: 3px;
}
.buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(50px, auto);
  width: min(350px, 100%);
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
  gap: 5px;
}
.button {
  background-color: #e98077;
  padding: 6px;
  border-radius: 4px;
  margin: 4px;
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  text-align: center;
  transition: all 0.2s ease-in-out;
}
.button:active {
  background-color: #cf5e54;
}
</style>