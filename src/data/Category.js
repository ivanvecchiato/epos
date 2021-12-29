
export default class Category {
  constructor() {
    this.id = [];
    this.name = '';
  }

  generate() {
    var list = [];
    for(var i=0; i<10; i++) {
      list.push({
        id: (i+1),
        name: 'categoria ' + (i+1)
      })
    }
    
    return list;
  }
}
