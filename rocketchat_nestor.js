/* exported Script */
/* globals console, _, s, HTTP */
class NestorMenu {
  constructor(menu){
    this.menu = menu;
  }
  
  todayMenu(){
    let lt = new Date();
    return this.menu.menus.filter((menu) => new Date(menu.date).toLocaleDateString() === lt.toLocaleDateString())[0];
  }
  
}

class FormatNestorMenu{
  
  constructor(){}
  
  /**
   * Format the menu.
   * @param: The menu
   * 
   **/
  formatMenu(menu){
    let mn = menu.menus[0];
    return {content: {
		text:`Aujourd\'hui *Nestor* vous propose _${mn.pushMessage}_ :`,
		attachments: [
			{text:[` :salad: En entrée ` + this.craftEmotMealCaract(mn.entree) +` : ${mn.entree.name} `,
					this.craftNote(mn.entree),
					` :bento: Plat ` + this.craftEmotMealCaract(mn.dish) +` : ${mn.dish.name} `,
					this.craftNote(mn.dish),
					` :cake: Dessert ` + this.craftEmotMealCaract(mn.dessert) +` : ${mn.dessert.name}`,
					this.craftNote(mn.dessert),
					this.craftPrice(mn)
				].join('\n'),
			title_link:'https://www.nestorparis.com/order',
			title:mn.label,
			image_url:mn.dish.image_url
			}
		]
	}}
  }
  
  /**
   * Craft the emote meal infos:
   * @param: The plate :
   * "entree":{
   *    "cold":true,
   *    "spicy":false,
   *    "vegan":false,
   *    "vegetarian":true,
   *    "no_egg":true,
   *    "no_nuts":true,
   *    "no_milk":false,
   *    "no_gluten":true
   * }
   **/
  craftEmotMealCaract(plate){
    return (plate.cold ? ':snowflake:' :'') + 
        (plate.spicy ? ':cactus:' :'');
  }
  
  /**
   * Craft Note:
   * @param: The plate : 
   *  "entree":{
   *      "review":{
   *          "nb_vote":771,
   *          "note":3.73
   *        }
   *    }
   **/
  craftNote(plate){
    return `===> Note: *${plate.review.note} / 5*`;
  }
  
  /**
   * Craft price
   * @param menu: 
   * "menus":[
   *  {
   *    "price":1500
   *  }
   *]
   **/
  craftPrice(menu){
    let priceAsString= (''+menu.price);
    return '======> *'+priceAsString.substring(priceAsString.length -2 , 0) + '* Eur.';
  }
}

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */
class Script {
  /**
   * @params {object} request
   */
  prepare_outgoing_request({ request }) {
    // request.params            {object}
    // request.method            {string}
    // request.url               {string}
    // request.auth              {string}
    // request.headers           {object}
    // request.data.token        {string}
    // request.data.channel_id   {string}
    // request.data.channel_name {string}
    // request.data.timestamp    {date}
    // request.data.user_id      {string}
    // request.data.user_name    {string}
    // request.data.text         {string}
    // request.data.trigger_word {string}
	return {
		url: request.url,
		headers: request.headers,
		method: 'GET'
    };
  }
  /**
   * @params {object} request, response
   */
  process_outgoing_response({ request, response }) {
    // request              {object} - the object returned by prepare_outgoing_request

    // response.error       {object}
    // response.status_code {integer}
    // response.content     {object}
    // response.content_raw {string/object}
    // response.headers     {object}

    let menObj = new NestorMenu(response.content);
    let format = new FormatNestorMenu();
    return format.formatMenu(menObj.todayMenu());
  }
}
