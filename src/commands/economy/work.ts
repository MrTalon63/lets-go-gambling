import { EmbedBuilder } from "discord.js";

import { RunFunction } from "../../interfaces/commands";
import { User } from "../../types";

const workTexts = [`Postanawiasz sprzedawać truskawki ukradzione sąsiadowi z działki. Zarabiasz {amount}zł.`, `Sprzedajesz zardzewiałe monety jako „antyki” na pchlim targu. Twoje konto powiększa się o {amount}zł.`, `Przemycasz cukierki do szkoły i sprzedajesz je pod stołem wpadło {amount}zł z zysku!`, `Tworzysz fałszywą stronę z prognozami giełdowymi, żeby sprzedawać 'pewne' wskazówki inwestycyjne. Zarobiłeś {amount}zł, zanim zbanowali ci konto.`, `Wyprodukowałeś własne napoje energetyczne (skład: sok i cukier) i sprzedajesz jako „100% naturalny doping”. Zarabiasz {amount}zł.`, `Pomagasz znajomym załatwić 'ekskluzywne' skiny do gier w zamian za małą prowizję. Po dwóch dniach jesteś bogatszy o {amount}zł.`, `Stworzyłeś biznes mycia okien sąsiadom za 5 zł od okna. Zarabiasz {amount}zł!`, `Otwierasz stoisko z 'oryginalnymi' podróbkami perfum pod szkołą. Sprzedajesz kilkanaście flakonów i wychodzisz na plus {amount}zł.`, `Zarabiasz na 'reklamach' na serwerze - każdy, kto chce wspomnieć o swojej działalności, płaci drobną opłatę. Twój bilans to {amount}zł`];

export const run: RunFunction = async (client, message) => {
	const userData = await client.db("SELECT * FROM gamblebot.users WHERE udid = $1", [message.author.id]);
	if (userData.rowCount === 0) {
		message.reply("Nie znaleziono użytkownika");
		return;
	}

	const user: User = userData.rows[0];
	if (parseInt(user.last_work) + 1000 * 60 * 60 > Date.now()) {
		message.reply(`Musisz odczekać ${new Date(parseInt(user.last_work) + 1000 * 60 * 60 - Date.now()).getMinutes()}m ${new Date(parseInt(user.last_work) + 1000 * 60 * 60 - Date.now()).getSeconds()}s zanim zaczniesz znowu pracować`);
		return;
	}

	const revenue = Math.floor(Math.random() * 1000);

	await client.db("UPDATE gamblebot.users SET balance = balance + $1, last_work = $2 WHERE udid = $3", [revenue, Date.now(), message.author.id]);

	const embed = new EmbedBuilder()
		.setColor("Blue")
		.setTitle("Praca")
		.setDescription(workTexts[Math.floor(Math.random() * workTexts.length)].replace("{amount}", revenue.toString()))
		.setTimestamp(new Date())
		.setFooter({
			text: `Wygenerowane dla ${message.author.tag}`,
			iconURL: message.author.displayAvatarURL(),
		});
	message.channel.send({ embeds: [embed] });
};

export const name = "work";
export const aliases = ["praca"];
export const description = "Work for money";
