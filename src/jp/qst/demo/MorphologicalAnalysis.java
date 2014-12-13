package jp.qst.demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import jp.qst.demo.been.JsonOutputDataParent;
import net.java.sen.SenFactory;
import net.java.sen.StringTagger;
import net.java.sen.dictionary.Token;

import com.google.gson.Gson;


/**
 * Servlet implementation class MorphologicalAnalysis
 */
public class MorphologicalAnalysis extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private String PARAM_INPUT_KEY="input_data";
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MorphologicalAnalysis() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		request.setCharacterEncoding("UTF-8");
		String input_data = request.getParameter(PARAM_INPUT_KEY);
		if(StringUtils.isEmpty(input_data)) {
			return;
		}

		// key:hinsi,value:tangoList(tango,cnt)
		Map<String,HashMap<String,Integer>> hinsi_tangoList = new HashMap<String,HashMap<String,Integer>>();
		StringTagger tagger = SenFactory.getStringTagger(null);
		List<Token> tokens = new ArrayList<Token>();
		tagger.analyze(input_data, tokens);

		// 解析結果を出力
		for (Token token : tokens) {
			String tango = token.getSurface();
			String hinsi = token.getMorpheme().getPartOfSpeech();
			HashMap tangoList = hinsi_tangoList.get(hinsi);
			// まだ存在しない品詞の場合
			if (tangoList == null) {
				// key:tango,value:cnt
				tangoList = new HashMap<String,Integer>();
				tangoList.put(tango,1);

			// すでに存在する品詞の場合
			} else {
				Integer tango_cnt = (Integer) tangoList.get(tango);
				// まだ存在しない単語の場合
				if (tango_cnt == null) {
					tango_cnt = 1;

				// すでに存在する単語の場合
				} else {
					tango_cnt++;
				}
				// 単語を登録
				tangoList.put(tango, tango_cnt);
			}
			// 品詞に単語リストを登録
			hinsi_tangoList.put(hinsi, tangoList);
		}
		Gson gson = new Gson();

		// 品詞のリストを格納するJson用オブジェクト
		List<JsonOutputDataParent> hinsiListJson = new ArrayList<JsonOutputDataParent>();
		// 単語のリストを格納するJson用オブジェクト
		List<JsonOutputDataParent> tangListJson = null;
		//Jsonに値を設定
		for (String key : hinsi_tangoList.keySet()) {
			// 単語リストを初期化
			tangListJson = new ArrayList<JsonOutputDataParent>();

			// 品詞を指定して、単語リストのMapを取得
			HashMap<String,Integer> tangoListMap = hinsi_tangoList.get(key);

			// 単語リストのMapをリストに変換
			ArrayList<String> tangoList = new ArrayList<String>(tangoListMap.keySet());

			// 単語のリストをJson用のリストに格納
			for (String tango : tangoList) {
				JsonOutputDataParent tangoJson = new JsonOutputDataParent();
				tangoJson.setName(tango);
				tangListJson.add(tangoJson);
			}
			// 品詞のリストに品詞名とJson用単語リストを格納
			JsonOutputDataParent hinsiJson = new JsonOutputDataParent();
			hinsiJson.setName(key);
			hinsiJson.setChildren(tangListJson);
			hinsiListJson.add(hinsiJson);
		}
		// 親オブジェクトを生成
		JsonOutputDataParent outputDataJson = new JsonOutputDataParent();
		//入力データを設定
		outputDataJson.setName(input_data);
		//解析結果を設定
		outputDataJson.setChildren(hinsiListJson);

		// レスポンス
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		out.print(gson.toJson(outputDataJson));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
