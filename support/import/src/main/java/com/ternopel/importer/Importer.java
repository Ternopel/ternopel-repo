package com.ternopel.importer;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.testng.log4testng.Logger;

/**
 * @author Maxi
 *
 */
public class Importer {
	
	private static Logger logger = Logger.getLogger(Importer.class);
	private static final String 		INVALID_CHARS 								= "([^A-Za-z_0-9]){1,3000}";
	private static final String 		INVALID_CHARS2 								= "^[-]|[-]$";

	/**
	 * @param is
	 * @throws Exception
	 */
	public void importFile(InputStream is) throws Exception {
		if(is==null) {
			throw new Exception("Input stream is invalid");
		}
		
		NumberFormat nf = NumberFormat.getInstance(Locale.ITALIAN);
		
		Connection connection=getConnection();
		executeCommand(connection, "delete from products_formats");
		executeCommand(connection, "delete from products_pictures");
		executeCommand(connection, "delete from posters");
		executeCommand(connection, "delete from products");
		executeCommand(connection, "delete from packaging");
		executeCommand(connection, "delete from categories");
		
		Map<String,Long> categorias=new HashMap<String,Long>();
		Map<String,Long> packagings=new HashMap<String,Long>();
		Map<String,Long> products=new HashMap<String,Long>();
		
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String line;
		int contador=0;
		int renglon=0;
		while((line=br.readLine())!=null) {
			String tokens[]=line.split("\t");
			if(tokens.length==14) {
				String categoria			=WordUtils.capitalizeFully(tokens[1].trim().replaceAll(" +", " "));
				String producto				=WordUtils.capitalizeFully(tokens[2].trim().replaceAll(" +", " "));
				String formato				=WordUtils.capitalizeFully(tokens[3].trim().replaceAll(" +", " "));
				String preciominorista		=tokens[4].trim();
				String unidades				=tokens[5].trim();
				String preciomayorista		=tokens[6].trim();
				String cantidad				=tokens[7].trim();
				String packaging			=WordUtils.capitalizeFully(tokens[10].trim().replaceAll(" +", " "));
				
				if(StringUtils.isNotEmpty(categoria) &&
						StringUtils.isNotEmpty(producto) &&
						StringUtils.isNotEmpty(formato) &&
						StringUtils.isNotEmpty(preciominorista) &&
						StringUtils.isNotEmpty(unidades) &&
						StringUtils.isNotEmpty(preciomayorista) &&
						StringUtils.isNotEmpty(cantidad) &&
						StringUtils.isNotEmpty(packaging) &&
						StringUtils.isNotEmpty(categoria)) {
					
					if(categorias.get(categoria)==null) {
						Long id = getId(connection, "categories_sequence");
						insertCategory(connection,categoria,id);
						categorias.put(categoria,id);
					}
					if(packagings.get(packaging)==null) {
						Long id = getId(connection, "packaging_sequence");
						insertPackaging(connection,packaging,id);
						packagings.put(packaging,id);
					}
					
					if(products.get(categoria+producto)==null) {
						Long id = getId(connection, "products_sequence");
						insertProduct(connection, id, categorias.get(categoria), packagings.get(packaging), producto);
						products.put(categoria+producto,id);
					}
					
					Float cantidadFl = nf.parse(cantidad).floatValue();
					Float unidadesFl = nf.parse(unidades).floatValue();
					Float mayoristaFl = nf.parse(StringUtils.remove(preciomayorista,"$")).floatValue();
					Float minoristaFl = nf.parse(StringUtils.remove(preciominorista,"$")).floatValue();
					
					Long id = getId(connection, "products_formats_sequence");
					insertProductFormat(connection,id,products.get(categoria+producto),formato,cantidadFl,unidadesFl,mayoristaFl,minoristaFl);
					contador++;
					
				}
				
			}
			renglon++;
			logger.info(renglon);
		}
		
		logger.warn("Categorias insertados:"+categorias.size());
		logger.warn("Packaging insertados:"+packagings.size());
		logger.warn("Productos insertados:"+products.size());
		logger.warn("Formatos:"+contador);
	}
	
	/**
	 * @param conn
	 * @param command
	 * @throws Exception
	 */
	private void executeCommand(Connection conn, String command) throws Exception {
		logger.info("Executing command:"+command);
		Statement statement = conn.createStatement();
		statement.executeUpdate(command);
		statement.close();
	}
	
	/**
	 * @param conn
	 * @param sequence
	 * @return
	 * @throws Exception
	 */
	private Long getId(Connection conn, String sequence) throws Exception {
		Statement statement = conn.createStatement();
		ResultSet rs = statement.executeQuery("select nextval('"+sequence+"')");
		if(rs.next()) {
			Long id = rs.getLong(1);
			rs.close();
			statement.close();
			return id;
		}
		throw new Exception("Could not get sequence value");
	}
	
	private void insertCategory(Connection conn,String name, Long id) throws Exception {
		PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO categories (id,name,url) VALUES (?,?,?)");
		preparedStatement.setLong(1, id);
		preparedStatement.setString(2, name);
		preparedStatement.setString(3, getUrl(name));
		preparedStatement .executeUpdate();		
		preparedStatement.close();
	}
	
	private void insertPackaging(Connection conn,String name, Long id) throws Exception {
		PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO packaging (id,name) VALUES (?,?)");
		preparedStatement.setLong(1, id);
		preparedStatement.setString(2, name);
		preparedStatement .executeUpdate();		
		preparedStatement.close();
	}
	
	private void insertProduct(Connection conn,Long id,Long categoryId,Long packagingId,String name) throws Exception {
		PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO products (id,category_id,packaging_id,name,description,url,show_format,is_visible,is_offer) VALUES (?,?,?,?,?,?,false,true,false)");
		preparedStatement.setLong(1, id);
		preparedStatement.setLong(2, categoryId);
		preparedStatement.setLong(3, packagingId);
		preparedStatement.setString(4, name);
		preparedStatement.setString(5, name);
		preparedStatement.setString(6, getUrl(name));
		preparedStatement .executeUpdate();		
		preparedStatement.close();
	}
	
	private void insertProductFormat(Connection conn,Long id,Long productId,String format,float quantity,float units,float wholesale,float retail) throws Exception {
		PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO products_formats (id,product_id,format,quantity,units,wholesale,retail) VALUES (?,?,?,?,?,?,?)");
		preparedStatement.setLong(1, id);
		preparedStatement.setLong(2, productId);
		preparedStatement.setString(3, format);
		preparedStatement.setFloat(4, quantity);
		preparedStatement.setFloat(5, units);
		preparedStatement.setFloat(6, wholesale);
		preparedStatement.setFloat(7, retail);
		preparedStatement .executeUpdate();		
		preparedStatement.close();
	}
	
	private String getUrl(String description) {
		return description.replaceAll(INVALID_CHARS, "-").replaceAll(INVALID_CHARS2, "").toLowerCase();
	}
	
	/**
	 * @return
	 * @throws Exception
	 */
	private Connection getConnection() throws Exception {
		Properties prop = new Properties();
		InputStream in = getClass().getResourceAsStream("/connection.properties");
		prop.load(in);
		in.close();
		
		Class.forName(prop.getProperty("driver"));
		
		return DriverManager.getConnection(prop.getProperty("url"), prop);
	}
	
	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String args[]) throws Exception {
		Importer importer=new Importer();
		importer.importFile(importer.getClass().getResourceAsStream("/excel.tsv"));
	}
}
