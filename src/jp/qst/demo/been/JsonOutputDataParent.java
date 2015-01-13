package jp.qst.demo.been;

import java.util.List;

public class JsonOutputDataParent {
	private String name=null;
	private List<JsonOutputDataParent> children=null;
	private int frequent = 0;

	public int getFrequent() {
		return frequent;
	}

	public void setFrequent(int frequent) {
		this.frequent = frequent;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public List<JsonOutputDataParent> getChildren() {
		return children;
	}
	public void setChildren(List<JsonOutputDataParent> children) {
		this.children = children;
	}

}
