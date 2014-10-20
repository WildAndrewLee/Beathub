import java.util.ArrayList;

public class Utilities {
	public static int addBytes(byte[] arr){
		 int sum = 0;
		 
	    for(int n = 0; n < arr.length; n++){
	        int shift = n * 8;
	        sum += (arr[n] & 0xFF) << shift;
	    }
	    
	    return sum;
	}
	
	public static byte[] intToBytes4(int n){
		byte[] bytes = new byte[4];
		
		bytes[0] = (byte) (n & 0xFF);
		bytes[1] = (byte) ((n >> 8) & 0xFF);
		bytes[2] = (byte) ((n >> 16) & 0xFF);
		bytes[3] = (byte) ((n >> 24) & 0xFF);
		
		return bytes;
	}
	
	public static byte[] intToBytes2(int n){
		byte[] bytes = new byte[2];
		
		bytes[0] = (byte) (n & 0xFF);
		bytes[1] = (byte) ((n >> 8) & 0xFF);
		
		return bytes;
	}
	
	public static void addAllBytes(ArrayList<Byte> list, byte[] bytes){
		for(int n = 0; n < bytes.length; n++){
			list.add(bytes[n]);
		}
	}
}