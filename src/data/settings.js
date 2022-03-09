let settings = {
   'allowQuickBill': {
      value: {
         type: 'boolean',
         value: false
      }
   },
   'printNoteOnBill': {
      value: {
         type: 'boolean',
         value: true
      }
   },
   'printHeaderOnPrebill': {
      value: {
         type: 'boolean',
         value: true
      }
   },
   'startingView': {
      value: {
         type: 'radio',
         value: 0 //0=frontend, 1=conti
      }
   },
   'productGridColumns': {
      value: {
         type: 'int',
         value: 6
      }
   },
   'bellSoundOnOrder': {
      value: {
         type: 'boolean',
         value: true
      }
   },
   'printPricesOnOrder': {
      value: {
         type: 'boolean',
         value: false
      }
   }
}

export default settings;